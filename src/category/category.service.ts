import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryDto } from "./dto/category.dto";
import { CategoryRepository } from "./category.repository";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { toCategoryDto, toCategoryDtoArray } from "./category.mapper";
import { CreateCategoryDto } from "./dto/category.create.dto";
import { UpdateCategoryDto } from "./dto/category.update.dto";
import { CategoryHasTasksDto } from "./dto/category.hasTasks.dto";
import { ParamsValidation } from "../common/paramsValidation";

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
        ParamsValidation.validateId(id);
        let category = await this.categoryRepository.getById(id);
        if (category == null)
            throw new NotFoundException(`Не найдена категория с идентификатором ${id}`);
        return toCategoryDto(category);
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
        let newCategory = await this.categoryRepository.create(createCategoryDto);
        return toCategoryDto(newCategory);
    } 

    async update(id: number, updateCategoryDto: UpdateCategoryDto) : Promise<CategoryDto> {
        ParamsValidation.validateId(id);
        let updatedCategory = await this.categoryRepository.update(id, updateCategoryDto);
        if (updatedCategory == null)
            throw new NotFoundException(`Не найдена категория с идентификатором ${id}`);
        return toCategoryDto(updatedCategory);
    }

    async hasTasks(id: number) : Promise<CategoryHasTasksDto> {
        ParamsValidation.validateId(id);
        return { hasTasks: await this.categoryRepository.hasTasks(id) };    //Проверить что будет если не найдена задача с id
    }

    async delete(id: number) {
        ParamsValidation.validateId(id);
        await this.categoryRepository.delete(id);
    }

    async deleteForce(id: number) {
        ParamsValidation.validateId(id);
        this.categoryRepository.deleteForce(id);
    }
}