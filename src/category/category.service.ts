import { Injectable } from "@nestjs/common";
import { CategoryDto } from "./dto/category.dto";
import { CategoryRepository } from "./category.repository";
import { IPagingOptions } from "src/pagination/pagination";
import { toCategoryDto, toCategoryDtoArray } from "./category.mapper";

@Injectable()
export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) {}

    async getAllCategories(pagingOptions: Partial<IPagingOptions>): Promise<CategoryDto[]> {
        let result = await this.categoryRepository.getAllCategories(pagingOptions);
        //TODO: Нужно ли возвращать result.pagination?
        return toCategoryDtoArray(result.items);
    }
}