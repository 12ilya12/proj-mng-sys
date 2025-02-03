import { Injectable } from "@nestjs/common";
import { CategoryDto } from "./dto/category.dto";
import { CategoryRepository } from "./category.repository";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { toCategoryDto, toCategoryDtoArray } from "./category.mapper";
import { CreateCategoryDto } from "./dto/category.create.dto";
import { UpdateCategoryDto } from "./dto/category.update.dto";
import { CategoryHasTasksDto } from "./dto/category.hasTasks.dto";

@Injectable()
export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) {}

    async getAll(pagingOptions: Partial<IPagingOptions>): Promise<IPaging<CategoryDto>> {
        let result = await this.categoryRepository.getAll(pagingOptions);
        let categories = toCategoryDtoArray(result.items);
        return { items: categories, 
            pagination: result.pagination
        }
    }

    async getById(id: number) : Promise<CategoryDto> {
        let category = await this.categoryRepository.getById(id);
        return toCategoryDto(category);
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
        let newCategory = await this.categoryRepository.create(createCategoryDto);
        return toCategoryDto(newCategory);
    } 

    async update(id: number, updateCategoryDto: UpdateCategoryDto) : Promise<CategoryDto> {
        let updatedCategory = await this.categoryRepository.update(id, updateCategoryDto);
        return toCategoryDto(updatedCategory);
    }

    async hasTasks(id: number) : Promise<CategoryHasTasksDto> {
        return { hasTasks: await this.categoryRepository.hasTasks(id) };
    }

    async delete(id: number) {
        await this.categoryRepository.delete(id);
    }

    async deleteForce(id: number) {
        this.categoryRepository.deleteForce(id);
    }
}