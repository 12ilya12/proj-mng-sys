import { Body, Controller, Get, Param, Post, Query, SetMetadata, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDto } from "./dto/category.dto";
import { IPagingOptions } from "../pagination/pagination";
import { RolesGuard } from "../auth/auth.roleGuard";

@Controller('category')
@UseGuards(RolesGuard)
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get()
    getAllCategories(@Query() pagingOptions: Partial<IPagingOptions>): Promise<CategoryDto[]> {
        //TODO: Валидация pagingOption
        return this.categoryService.getAllCategories(pagingOptions);
    }

    @Get(':id')
    getCategoryById(@Param('id') id: string) : Promise<CategoryDto> {
        return this.categoryService.getCategoryById(id);
    }

/*     @Post()
    @SetMetadata('roles', ['ADMIN'])
    createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        
    } */



}