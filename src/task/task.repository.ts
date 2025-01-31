//import { drizzle } from "drizzle-orm/postgres-js"
import { TaskPersistType } from "./task.persistType";
import { taskTable } from "../db/schema";
import { DrizzleService } from "../db/drizzle.service";
import { ConflictException, Injectable } from "@nestjs/common";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { AnyColumn, asc, count, desc, eq, and } from "drizzle-orm";
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

        //Определяем по какой колонке сортируем, если это потребуется. По умолчанию, будем сортировать по id.
        let columnOrderBy: AnyColumn = taskTable.id;
        switch (pagingOptions.orderBy) {
            case 'id':
                columnOrderBy = taskTable.id;
                break;
            case 'name':
                columnOrderBy = taskTable.name;
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

        return {items: await items, pagination: {totalItems: 1, totalPages: 1, options: pagingOptions}};
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

    async update(id: number, taskInfo: UpdateTaskDto) : Promise<TaskPersistType> {
        let updatedTask = (await this.drizzle.db.update(taskTable).
            set(taskInfo).where(eq(taskTable.id, id)).returning())[0];
        return updatedTask;
    }

    async updateStatus(id: number, statusId: number, userId: number) : Promise<TaskPersistType> {
        //Насколько я понял, начиная с 0.32 версии Drizzle есть ошибка, не позволяющая 
        //передавать в update().set() некоторые отдельные поля (в данном случае statusId).
        //Пока нашёл такой выход из ситуации
        const statusIdData: Partial<typeof taskTable.$inferSelect> = {
            statusId: statusId,
        }   
         let updatedTask = (await this.drizzle.db.update(taskTable).set(
            statusIdData
            //{ statusId: statusId }
        ).where(and(eq(taskTable.id, id),eq(taskTable.userId, userId))).returning())[0];
        return updatedTask; 
    }



    /* async hasTasks(id: number) : Promise<boolean> {
        let taskCount: number;
        taskCount = (await this.drizzle.db.select({ value: count() }).from(taskTable).where(eq(taskTable.taskId, id)))[0].value;
        return taskCount > 0;
    }  */

    async delete(id: number) {
        /* await this.drizzle.db.transaction(async (tx) => {
            if (this.hasTasks(id)) {
                throw new ConflictException(); //tx.rollback(); ?
            }
            await this.drizzle.db.delete(taskTable).where(eq(taskTable.id, id));
        }); */
        
    }
}