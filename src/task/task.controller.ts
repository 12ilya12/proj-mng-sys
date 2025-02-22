import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
  Request,
  ParseIntPipe
} from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskDto } from './dto/task.dto'
import { IPaging, IPagingOptions } from '../pagination/pagination'
import { RolesGuard } from '../auth/auth.roleGuard'
import { CreateTaskDto } from './dto/task.create.dto'
import { UpdateTaskDto } from './dto/task.update.dto'
import { TaskFilterDto } from './dto/task.filter.dto'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'

@Controller('tasks')
@UseGuards(RolesGuard)
@ApiTags('Задачи')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех задач' })
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
      'Критерий сортировки ("id", "name", "description", "categoryId", "statusId", "userId", "deadline", "priority")',
    type: String
  })
  @ApiBody({
    description: 'Параметры фильтрации',
    type: TaskFilterDto
  })
  @ApiOkResponse({ description: 'Успех' })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  getAll(
    @Query() pagingOptions: Partial<IPagingOptions>,
    @Body() filter: TaskFilterDto,
    @Request() req
  ): Promise<IPaging<TaskDto>> {
    return this.taskService.getAll(pagingOptions, filter, req.user)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить задачу по ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Идентификатор задачи',
    type: Number
  })
  @ApiOkResponse({ description: 'Успех', type: TaskDto })
  @ApiNotFoundResponse({
    description: 'Не найдена задача с заданным идентификатором'
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  getById(@Param('id', ParseIntPipe) id: number): Promise<TaskDto> {
    return this.taskService.getById(id)
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую задачу' })
  @ApiBody({ required: true, type: CreateTaskDto })
  @ApiCreatedResponse({
    description: 'Задача успешно создана',
    type: TaskDto
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @SetMetadata('roles', ['ADMIN'])
  create(@Body() createTaskDto: CreateTaskDto): Promise<TaskDto> {
    let newTask = this.taskService.create(createTaskDto)
    return newTask
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить задачу по ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Идентификатор задачи',
    type: Number
  })
  @ApiBody({ required: true, type: UpdateTaskDto })
  @ApiOkResponse({ description: 'Успех', type: TaskDto })
  @ApiNotFoundResponse({
    description: 'Не найдена задача с заданным идентификатором'
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @SetMetadata('roles', ['ADMIN', 'USER'])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req
  ): Promise<TaskDto> {
    let updatedTask = this.taskService.update(
      id,
      updateTaskDto,
      req.user
    )
    return updatedTask
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить задачу по ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Идентификатор задачи',
    type: Number
  })
  @ApiOkResponse({ description: 'Успех' })
  @ApiNotFoundResponse({
    description: 'Не найдена задача с заданным идентификатором'
  })
  @ApiConflictResponse({
    description: 'У данной задачи есть зависимости'
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @SetMetadata('roles', ['ADMIN'])
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.taskService.delete(id)
  }
}
