import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { DrizzleService } from "../db/drizzle.service";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { DependencyPersistType } from "./dependency.persistType";
import { dependencyTable } from "../db/schema";
import { AnyColumn, asc, count, desc, eq, and } from "drizzle-orm";
import { TaskRepository } from "../task/task.repository";

@Injectable()
export class DependencyRepository {
    constructor(private drizzle: DrizzleService, private taskRepository: TaskRepository) {}

    async getAll(parentTaskId: number, pagingOptions: Partial<IPagingOptions>): Promise<IPaging<DependencyPersistType>> {
        let items = this.drizzle.db.select().from(dependencyTable).where(eq(dependencyTable.parentTaskId, parentTaskId));
        const totalItems: number = (await items).length;
        const totalPages: number = pagingOptions.pageSize ? Math.ceil(totalItems / pagingOptions.pageSize) : 1;

        //Определяем по какой колонке сортируем, если это потребуется. По умолчанию, будем сортировать по id.
        let columnOrderBy: AnyColumn = dependencyTable.id;
        switch (pagingOptions.orderBy) {
            case 'id':
                columnOrderBy = dependencyTable.id;
                break;
            case 'childTaskId':
                columnOrderBy = dependencyTable.childTaskId;
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

    async create(parentTaskId: number, childTaskId : number, userInfo) : Promise<DependencyPersistType> {
        const parentTaskUserId = (await this.taskRepository.getById(parentTaskId)).userId;
        const childTaskUserId = (await this.taskRepository.getById(childTaskId)).userId;
        //Обычный пользователь может создавать зависимости только между своими задачами
        if ((userInfo.role === 'USER')&&((userInfo.id !== parentTaskUserId)||(userInfo.id !== childTaskUserId)))
            throw new ForbiddenException();
        let newDependency = (await this.drizzle.db.insert(dependencyTable).values({
            parentTaskId: parentTaskId,
            childTaskId: childTaskId
        }).returning())[0];
        return newDependency;
    }

    async delete(parentTaskId : number, dependencyId : number) {
        const depForDelete = this.drizzle.db.select().from(dependencyTable)
            .where(and(eq(dependencyTable.id, dependencyId), eq(dependencyTable.parentTaskId, parentTaskId)));
        if (await depForDelete) //Протестить
            this.drizzle.db.delete(dependencyTable).where(eq(dependencyTable.id, dependencyId));
        else
            throw new BadRequestException('Не найдена зависимость с идентификатором ${dependencyId} задачи с идентификатором ${parentTaskId}');
    }
}