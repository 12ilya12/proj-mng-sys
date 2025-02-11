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
  UseGuards
} from '@nestjs/common'
import { StatusService } from './status.service'
import { StatusDto } from './dto/status.dto'
import { IPaging, IPagingOptions } from '../pagination/pagination'
import { RolesGuard } from '../auth/auth.roleGuard'
import { CreateStatusDto } from './dto/status.create.dto'
import { UpdateStatusDto } from './dto/status.update.dto'
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

@Controller('statuses')
@UseGuards(RolesGuard)
@ApiTags('Статусы задач')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех статусов' })
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
    description: 'Критерий сортировки ("id", "name")',
    type: String
  })
  @ApiOkResponse({ description: 'Успех' })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  getAll(
    @Query() pagingOptions: Partial<IPagingOptions>
  ): Promise<IPaging<StatusDto>> {
    return this.statusService.getAll(pagingOptions)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить статус по ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Идентификатор статуса',
    type: Number
  })
  @ApiOkResponse({ description: 'Успех', type: StatusDto })
  @ApiNotFoundResponse({
    description: 'Не найдена статус с заданным идентификатором'
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  getById(@Param('id') id: number): Promise<StatusDto> {
    return this.statusService.getById(id)
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый статус' })
  @ApiBody({ required: true, type: CreateStatusDto })
  @ApiCreatedResponse({
    description: 'Статус успешно создан',
    type: StatusDto
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @SetMetadata('roles', ['ADMIN'])
  create(
    @Body() createStatusDto: CreateStatusDto
  ): Promise<StatusDto> {
    let newStatus = this.statusService.create(createStatusDto)
    return newStatus
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить статус по ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Идентификатор статуса',
    type: Number
  })
  @ApiBody({ required: true, type: UpdateStatusDto })
  @ApiOkResponse({ description: 'Успех', type: StatusDto })
  @ApiNotFoundResponse({
    description: 'Не найден статус с заданным идентификатором'
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @SetMetadata('roles', ['ADMIN'])
  update(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateStatusDto
  ): Promise<StatusDto> {
    let updatedStatus = this.statusService.update(id, updateStatusDto)
    return updatedStatus
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить статус по ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Идентификатор статуса',
    type: Number
  })
  @ApiOkResponse({ description: 'Успех' })
  @ApiNotFoundResponse({
    description: 'Не найден статус с заданным идентификатором'
  })
  @ApiConflictResponse({
    description: 'У данного статуса есть связанные задачи'
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @SetMetadata('roles', ['ADMIN'])
  async delete(@Param('id') id: number) {
    await this.statusService.delete(id)
  }
}
