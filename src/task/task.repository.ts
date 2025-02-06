//import { drizzle } from "drizzle-orm/postgres-js"
import { TaskPersistType } from "./task.persistType";
import { dependencyTable, taskTable } from "../db/schema";
import { DrizzleService } from "../db/drizzle.service";
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { AnyColumn, asc, count, desc, eq, and, or } from "drizzle-orm";
import { CreateTaskDto } from "./dto/task.create.dto";
import { UpdateTaskDto } from "./dto/task.update.dto";
import { TaskFilterDto } from "./dto/task.filter.dto";


@Injectable()
export class TaskRepository {
    constructor(private drizzle: DrizzleService) {}

    async getAll(pagingOptions: Partial<IPagingOptions>, filter: TaskFilterDto, userInfo): Promise<IPaging<TaskPersistType>> {
        let items = this.drizzle.db.select().from(taskTable);

        // Фильтруем по категориям и статусам, если были заданы фильтры
        if (filter.categoryId)
            items.where(eq(taskTable.categoryId, filter.categoryId));
        if (filter.statusId)
            items.where(eq(taskTable.statusId, filter.statusId));

        //Ролевая фильтрация. Если обычный пользователь, запрашиваем только его задачи.
        if (userInfo.role == 'USER')
            items.where(eq(taskTable.userId, userInfo.id));

        const totalItems: number = (await items).length;
        const totalPages: number = pagingOptions.pageSize ? Math.ceil(totalItems / pagingOptions.pageSize) : 1;

        //Определяем по какой колонке сортируем, если это потребуется. По умолчанию, будем сортировать по id.
        let columnOrderBy: AnyColumn = taskTable.id;
        switch (pagingOptions.orderBy) {
            case 'id':
                columnOrderBy = taskTable.id;
                break;
            case 'name':
                columnOrderBy = taskTable.name;
                break;
            case 'categoryId':
                columnOrderBy = taskTable.categoryId;
                break;
            case 'statusId':
                columnOrderBy = taskTable.statusId;
                break;
            case 'userId':
                columnOrderBy = taskTable.userId;
                break;
            case 'deadline':
                columnOrderBy = taskTable.deadline;
                break;
            case 'priority':
                columnOrderBy = taskTable.priority;
                break;
        }

        //Сортировка. По умолчанию по возрастанию
        if (pagingOptions.order === 'desc')    
            items.orderBy(desc(columnOrderBy));
        else
            //'asc' или не определено
            items.orderBy(asc(columnOrderBy));

        //Если задан размер страницы, ограничиваем количество записей
        if (pagingOptions.pageSize)
            items.limit(Number(pagingOptions.pageSize));

        //Если задан номер страницы, то делаем отступ
        if (pagingOptions.page)
           items.offset((Number(pagingOptions.page) - 1) * Number(pagingOptions.pageSize));

        return {items: await items, pagination: {totalItems: totalItems, totalPages: totalPages, options: pagingOptions}};
    }

    async getById(id: number) : Promise<TaskPersistType> {
        let task = (await this.drizzle.db.select().from(taskTable).where(eq(taskTable.id, id)))[0];
        return task;
    } 

    async create(taskInfo: CreateTaskDto) : Promise<TaskPersistType> {
        return await this.drizzle.db.transaction(async (tx) => {
            let newTask = (await this.drizzle.db.insert(taskTable).values(taskInfo).returning())[0];
            return newTask;
        }); 
    }

    async taskForUser(taskId: number, userId: number) : Promise<boolean> {
        return (await this.drizzle.db.select().from(taskTable).where(and(eq(taskTable.id, taskId),eq(taskTable.userId, userId)))).length === 0;
    }

    async update(id: number, taskInfo: UpdateTaskDto) : Promise<TaskPersistType> {
        let updatedTask = (await this.drizzle.db.update(taskTable).
            set(taskInfo).where(eq(taskTable.id, id)).returning())[0];
        return updatedTask;       
    }

    async updateStatus(id: number, statusId: number, userId: number) : Promise<TaskPersistType> {
        /* //Начиная с 0.32 версии Drizzle есть особенность, не позволяющая 
        //передавать в update().set() некоторые отдельные поля (по крайней мере те, что не отмечены как notNull).
        //Если бы statusId не был отмечен как notNull, его можно было бы передать следующим образом.
        const statusIdData: Partial<typeof taskTable.$inferSelect> = { statusId: statusId }    
        this.drizzle.db.update(taskTable).set(statusIdData)...
        */
        let updatedTask = (await this.drizzle.db.update(taskTable).set(
            { statusId: statusId }
        ).where(and(eq(taskTable.id, id),eq(taskTable.userId, userId))).returning())[0];
        return updatedTask; 
    }

    async hasDependencies(id: number) : Promise<boolean> {
        let dependenciesCount: number;
        dependenciesCount = (await this.drizzle.db.select({ value: count() }).from(dependencyTable).
            where(or(eq(dependencyTable.parentTaskId, id), eq(dependencyTable.childTaskId, id))))[0].value;
        return dependenciesCount > 0;
    }  

    async delete(id: number) {
         await this.drizzle.db.transaction(async (tx) => {
            const taskForDelete = await this.drizzle.db.select().from(taskTable).where(eq(taskTable.id, id)); 
            if (taskForDelete.length === 0) {
                throw new NotFoundException(`Не найдена задача с идентификатором ${id}`);
            }
            if (await this.hasDependencies(id)) {
                throw new ConflictException('У данной задачи есть зависимости');
            }
            await this.drizzle.db.delete(taskTable).where(eq(taskTable.id, id));
        }); 
        
    }
}