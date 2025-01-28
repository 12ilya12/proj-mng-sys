//import { drizzle } from "drizzle-orm/postgres-js"
import { CategoryPersistType } from "./category.persistType";
import { categoryTable } from "../db/schema";
import { DrizzleService } from "../db/drizzle.service";
import { Injectable } from "@nestjs/common";
import { IPaging, IPagingOptions } from "src/pagination/pagination";
import { AnyColumn, asc, desc } from "drizzle-orm";


@Injectable()
export class CategoryRepository {
    constructor(private drizzle: DrizzleService) {}

    async getAllCategories(pagingOptions: Partial<IPagingOptions>): Promise<IPaging<CategoryPersistType>> {
        let items = this.drizzle.db.select().from(categoryTable);

        //Определяем по какой колонке сортируем, если это потребуется. По умолчанию, будем сортировать по id.
        let columnOrderBy: AnyColumn = categoryTable.id;
        switch (pagingOptions.orderBy) {
            case 'id':
                columnOrderBy = categoryTable.id;
                break;
            case 'name':
                columnOrderBy = categoryTable.name;
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
}