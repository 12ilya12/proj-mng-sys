//import { drizzle } from "drizzle-orm/postgres-js"
import { CategoryPersistType } from "./category.persistType";
import { categoryTable, taskTable } from "../db/schema";
import { DrizzleService } from "../db/drizzle.service";
import { ConflictException, Injectable } from "@nestjs/common";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { AnyColumn, asc, count, desc, eq } from "drizzle-orm";
import { CreateCategoryDto } from "./dto/category.create.dto";
import { UpdateCategoryDto } from "./dto/category.update.dto";


@Injectable()
export class CategoryRepository {
    constructor(private drizzle: DrizzleService) {}

    async getAll(pagingOptions: Partial<IPagingOptions>): Promise<IPaging<CategoryPersistType>> {
        let items = this.drizzle.db.select().from(categoryTable);
        const totalItems: number = (await items).length;
        const totalPages: number = pagingOptions.pageSize ? Math.ceil(totalItems / pagingOptions.pageSize) : 1;

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

        return { items: await items, pagination: {totalItems: totalItems, totalPages: totalPages, options: pagingOptions}};
    }

    async getById(id: number) : Promise<CategoryPersistType> {
        let category = (await this.drizzle.db.select().from(categoryTable).where(eq(categoryTable.id, id)))[0];
        return category;
    } 

    async create(categoryInfo: CreateCategoryDto) : Promise<CategoryPersistType> {
        return await this.drizzle.db.transaction(async (tx) => {
            let newCategory = (await this.drizzle.db.insert(categoryTable).values({
                name: categoryInfo.name
            }).returning())[0];
            return newCategory;
        });
    }

    async update(id: number, categoryInfo: UpdateCategoryDto) : Promise<CategoryPersistType> {
        let updatedCategory = (await this.drizzle.db.update(categoryTable).set({
            name: categoryInfo.name
        }).where(eq(categoryTable.id, id)).returning())[0];
        return updatedCategory;
    }

    async hasTasks(id: number) : Promise<boolean> {
        let taskCount: number;
        taskCount = (await this.drizzle.db.select({ value: count() }).from(taskTable).where(eq(taskTable.categoryId, id)))[0].value;
        return taskCount > 0;
    } 

    async delete(id: number) {
        await this.drizzle.db.transaction(async (tx) => {
            if (await this.hasTasks(id)) {
                throw new ConflictException();
            }
            await this.drizzle.db.delete(categoryTable).where(eq(categoryTable.id, id));
        });
    }

    async deleteForce(id: number) {
        await this.drizzle.db.transaction(async (tx) => {
            await this.drizzle.db.delete(categoryTable).where(eq(categoryTable.id, id));
        });
    }
}