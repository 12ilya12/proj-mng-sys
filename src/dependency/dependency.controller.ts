import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
  Delete
} from '@nestjs/common'
import { RolesGuard } from '../auth/auth.roleGuard'
import { IPaging, IPagingOptions } from '../pagination/pagination'
import { DependencyDto } from './dto/dependency.dto'
import { DependencyService } from './dependency.service'
import { CreateDependencyDto } from './dto/dependency.create.dto'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'

@Controller('tasks/:taskId/dependencies')
@UseGuards(RolesGuard)
@ApiTags('Зависимости задач')
export class DependencyController {
  constructor(private dependencyService: DependencyService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех зависимостей' })
  @ApiParam({
    name: 'taskId',
    required: true,
    description: 'Идентификатор родительской задачи',
    type: Number
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Номер страницы',
    type: Number
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Размер страницы',
    type: Number
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description:
      'Сортировка по возрастанию или убыванию ("asc", "desc")',
    type: String
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description:
      'Критерий сортировки ("id", "parentTaskId", "childTaskId")',
    type: String
  })
  @ApiOkResponse({ description: 'Успех' })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  getAll(
    @Param('taskId') taskId: number,
    @Query() pagingOptions: Partial<IPagingOptions>
  ): Promise<IPaging<DependencyDto>> {
    return this.dependencyService.getAll(taskId, pagingOptions)
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую зависимость' })
  @ApiParam({
    name: 'taskId',
    required: true,
    description: 'Идентификатор родительской задачи',
    type: Number
  })
  @ApiBody({ required: true, type: CreateDependencyDto })
  @ApiCreatedResponse({
    description: 'Зависимость успешно создана',
    type: DependencyDto
  })
  @ApiForbiddenResponse({
    description:
      'Пользователь может создавать зависимости только между своими задачами'
  })
  @ApiNotFoundResponse({
    description: 'Не найдена задача с заданным идентификатором'
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  create(
    @Param('taskId') taskId: number,
    @Body() createDependencyDto: CreateDependencyDto,
    @Request() req
  ): Promise<DependencyDto> {
    return this.dependencyService.create(
      taskId,
      createDependencyDto,
      req.user
    )
  }

  @Delete(':dependencyId')
  @ApiOperation({ summary: 'Удалить зависимость по ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Идентификатор зависимости',
    type: Number
  })
  @ApiOkResponse({ description: 'Успех' })
  @ApiNotFoundResponse({
    description: 'Не найдена зависимость с заданным идентификатором'
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  async delete(
    @Param('taskId') taskId: number,
    @Param('dependencyId') dependencyId: number
  ) {
    await this.dependencyService.delete(taskId, dependencyId)
  }
}
