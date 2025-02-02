//import { drizzle } from "drizzle-orm/postgres-js"
import { StatusPersistType } from "./status.persistType";
import { statusTable, taskTable } from "../db/schema";
import { DrizzleService } from "../db/drizzle.service";
import { ConflictException, Injectable } from "@nestjs/common";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { AnyColumn, asc, count, desc, eq } from "drizzle-orm";
import { CreateStatusDto } from "./dto/status.create.dto";
import { UpdateStatusDto } from "./dto/status.update.dto";


@Injectable()
export class StatusRepository {
    constructor(private drizzle: DrizzleService) {}

    async getAll(pagingOptions: Partial<IPagingOptions>): Promise<IPaging<StatusPersistType>> {
        let items = this.drizzle.db.select().from(statusTable);
        const totalItems: number = (await items).length;
        const totalPages: number = pagingOptions.pageSize ? Math.ceil(totalItems / pagingOptions.pageSize) : 1;

        //Определяем по какой колонке сортируем, если это потребуется. По умолчанию, будем сортировать по id.
        let columnOrderBy: AnyColumn = statusTable.id;
        switch (pagingOptions.orderBy) {
            case 'id':
                columnOrderBy = statusTable.id;
                break;
            case 'name':
                columnOrderBy = statusTable.name;
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

    async getById(id: number) : Promise<StatusPersistType> {
        let status = (await this.drizzle.db.select().from(statusTable).where(eq(statusTable.id, id)))[0];
        return status;
    } 

    async create(statusInfo: CreateStatusDto) : Promise<StatusPersistType> {
        return await this.drizzle.db.transaction(async (tx) => {
            let newStatus = (await this.drizzle.db.insert(statusTable).values({
                name: statusInfo.name
            }).returning())[0];
            return newStatus;
        });
    }

    async update(id: number, statusInfo: UpdateStatusDto) : Promise<StatusPersistType> {
        let updatedStatus = (await this.drizzle.db.update(statusTable).set({
            name: statusInfo.name
        }).where(eq(statusTable.id, id)).returning())[0];
        return updatedStatus;
    }

    async hasTasks(id: number) : Promise<boolean> {
        let taskCount: number;
        taskCount = (await this.drizzle.db.select({ value: count() }).from(taskTable).where(eq(taskTable.statusId, id)))[0].value;
        return taskCount > 0;
    } 

    async delete(id: number) {
        await this.drizzle.db.transaction(async (tx) => {
            if (await this.hasTasks(id)) {
                throw new ConflictException(); //tx.rollback(); ?
            }
            await this.drizzle.db.delete(statusTable).where(eq(statusTable.id, id));
        });
    }
}