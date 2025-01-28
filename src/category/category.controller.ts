import { Controller, Get, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDto } from "./dto/category.dto";
import { IPagingOptions } from "../pagination/pagination";

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get()
    getAllCategories(@Query() pagingOptions: Partial<IPagingOptions>): Promise<CategoryDto[]> {
        //TODO: Валидация pagingOption
        return this.categoryService.getAllCategories(pagingOptions);
    }

}