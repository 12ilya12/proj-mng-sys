import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, SetMetadata, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDto } from "./dto/category.dto";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { RolesGuard } from "../auth/auth.roleGuard";
import { CreateCategoryDto } from "./dto/category.create.dto";
import { UpdateCategoryDto } from "./dto/category.update.dto";
import { CategoryHasTasksDto } from "./dto/category.hasTasks.dto";
import { ApiOperation, ApiQuery, ApiTags, ApiParam, ApiBody, ApiOkResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiConflictResponse } from "@nestjs/swagger";

@Controller('categories')
@UseGuards(RolesGuard)
@ApiTags('Категории задач')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get()
    @ApiOperation({ summary: "Получить список всех категорий" })
    @ApiQuery( {name: 'page', required: false, description: 'Номер страницы', type: Number} )
    @ApiQuery( {name: 'pageSize', required: false, description: 'Размер страницы', type: Number} )
    @ApiQuery( {name: 'order', required: false, description: 'Сортировка по возрастанию или убыванию ("asc", "desc")', type: String} )
    @ApiQuery( {name: 'orderBy', required: false, description: 'Критерий сортировки ("id", "name")', type: String} )
    @ApiOkResponse({ description: "Успех"})
    @ApiBadRequestResponse({ description: "Некорректный запрос" })
    getAll(@Query() pagingOptions: Partial<IPagingOptions>): Promise<IPaging<CategoryDto>> {
        return this.categoryService.getAll(pagingOptions);
    }

    @Get(':id')
    @ApiOperation({ summary: "Получить категорию по ID" })
    @ApiParam( {name: 'id', required: true, description: 'Идентификатор категории', type: Number} )
    @ApiOkResponse({ description: "Успех", type: CategoryDto })
    @ApiNotFoundResponse({ description: "Не найдена категория с заданным идентификатором" })
    @ApiBadRequestResponse({ description: "Некорректный запрос" })
    getById(@Param('id') id: number) : Promise<CategoryDto> {
        return this.categoryService.getById(id);
    }

    @Post()
    @ApiOperation({ summary: "Создать новую категорию" })
    @ApiBody( {required: true, type: CreateCategoryDto} )
    @ApiCreatedResponse({ description: "Категория успешно создана", type: CategoryDto })
    @ApiBadRequestResponse({ description: "Некорректный запрос" })
    @SetMetadata('roles', ['ADMIN'])
    create(@Body() createCategoryDto: CreateCategoryDto) : Promise<CategoryDto> {
        let newCategory = this.categoryService.create(createCategoryDto);
        return newCategory;
    }

    @Patch(':id')
    @ApiOperation({ summary: "Обновить категорию по ID" })
    @ApiParam( {name: 'id', required: true, description: 'Идентификатор категории', type: Number} )
    @ApiBody( {required: true, type: UpdateCategoryDto} )
    @ApiOkResponse({ description: "Успех", type: CategoryDto })
    @ApiNotFoundResponse({ description: "Не найдена категория с заданным идентификатором" })
    @ApiBadRequestResponse({ description: "Некорректный запрос" })
    @SetMetadata('roles', ['ADMIN'])
    update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) : Promise<CategoryDto> {
        let updatedCategory = this.categoryService.update(id, updateCategoryDto);
        return updatedCategory;
    }

    @Get(':id/has-tasks')
    @ApiOperation({ summary: "Получить информацию, есть ли связанные задачи с категорией по ID" })
    @ApiParam( {name: 'id', required: true, description: 'Идентификатор категории', type: Number} )
    @ApiOkResponse({ description: "Успех", type: CategoryHasTasksDto })
    @ApiNotFoundResponse({ description: "Не найдена категория с заданным идентификатором" })
    @ApiBadRequestResponse({ description: "Некорректный запрос" })
    hasTasks(@Param('id') id: number) : Promise<CategoryHasTasksDto> {
        return this.categoryService.hasTasks(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: "Удалить категорию по ID" })
    @ApiParam( {name: 'id', required: true, description: 'Идентификатор категории', type: Number} )
    @ApiOkResponse({ description: "Успех" })
    @ApiNotFoundResponse({ description: "Не найдена категория с заданным идентификатором" })
    @ApiConflictResponse( {description: "У данной категории есть связанные задачи"} )
    @ApiBadRequestResponse({ description: "Некорректный запрос" })
    @SetMetadata('roles', ['ADMIN'])
    async delete(@Param('id') id: number) {
        await this.categoryService.delete(id);

    }

    @Delete(':id/force')
    @ApiOperation({ summary: "Принудительно удалить категорию по ID вместе со всеми связанными задачами каскадно" })
    @ApiParam( {name: 'id', required: true, description: 'Идентификатор категории', type: Number} )
    @ApiOkResponse({ description: "Успех" })
    @ApiNotFoundResponse({ description: "Не найдена категория с заданным идентификатором" })
    @ApiBadRequestResponse({ description: "Некорректный запрос" })
    @SetMetadata('roles', ['ADMIN'])
    async deleteForce(@Param('id') id: number) {
        await this.categoryService.deleteForce(id);
    }

}