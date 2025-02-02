import { Body, Controller, Delete, Get, Param, Patch, Post, Query, SetMetadata, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDto } from "./dto/category.dto";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { RolesGuard } from "../auth/auth.roleGuard";
import { CreateCategoryDto } from "./dto/category.create.dto";
import { UpdateCategoryDto } from "./dto/category.update.dto";
import { CategoryHasTasksDto } from "./dto/category.hasTasks.dto";

@Controller('categories')
@UseGuards(RolesGuard)
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get()
    getAll(@Query() pagingOptions: Partial<IPagingOptions>): Promise<IPaging<CategoryDto>> {
        //TODO: Валидация pagingOption
        return this.categoryService.getAll(pagingOptions);
    }

    @Get(':id')
    getById(@Param('id') id: number) : Promise<CategoryDto> {
        return this.categoryService.getById(id);
    }

    @Post()
    @SetMetadata('roles', ['ADMIN'])
    create(@Body() createCategoryDto: CreateCategoryDto) : Promise<CategoryDto> {
        let newCategory = this.categoryService.create(createCategoryDto);
        return newCategory;
    }

    @Patch(':id')
    @SetMetadata('roles', ['ADMIN'])
    update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) : Promise<CategoryDto> {
        let updatedCategory = this.categoryService.update(id, updateCategoryDto);
        return updatedCategory;
    }

    @Get(':id/has-tasks')
    hasTasks(@Param('id') id: number) : Promise<CategoryHasTasksDto> {
        return this.categoryService.hasTasks(id);
    }

    @Delete(':id')
    @SetMetadata('roles', ['ADMIN'])
    delete(@Param('id') id: number) {
        this.categoryService.delete(id);
    }

    @Delete(':id/force')
    @SetMetadata('roles', ['ADMIN'])
    deleteForce(@Param('id') id: number) {
        this.categoryService.deleteForce(id);
    }

}