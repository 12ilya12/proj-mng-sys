import { Injectable, NotFoundException } from '@nestjs/common'
import { StatusDto } from './dto/status.dto'
import { StatusRepository } from './status.repository'
import { IPaging, IPagingOptions } from '../pagination/pagination'
import { toStatusDto, toStatusDtoArray } from './status.mapper'
import { CreateStatusDto } from './dto/status.create.dto'
import { UpdateStatusDto } from './dto/status.update.dto'
import { ParamsValidation } from '../common/paramsValidation'

@Injectable()
export class StatusService {
  constructor(private statusRepository: StatusRepository) {}

  async getAll(
    pagingOptions: Partial<IPagingOptions>
  ): Promise<IPaging<StatusDto>> {
    ParamsValidation.validatePagingOptions(pagingOptions)
    let result = await this.statusRepository.getAll(pagingOptions)
    let statuses = toStatusDtoArray(result.items)
    return { items: statuses, pagination: result.pagination }
  }

  async getById(id: number): Promise<StatusDto> {
    ParamsValidation.validateId(id)
    let status = await this.statusRepository.getById(id)
    if (status == null)
      throw new NotFoundException(
        `Не найден статус с идентификатором ${id}`
      )
    return toStatusDto(status)
  }

  async create(createStatusDto: CreateStatusDto): Promise<StatusDto> {
    let newStatus =
      await this.statusRepository.create(createStatusDto)
    return toStatusDto(newStatus)
  }

  async update(
    id: number,
    updateStatusDto: UpdateStatusDto
  ): Promise<StatusDto> {
    ParamsValidation.validateId(id)
    let updatedStatus = await this.statusRepository.update(
      id,
      updateStatusDto
    )
    if (updatedStatus == null)
      throw new NotFoundException(
        `Не найден статус с идентификатором ${id}`
      )
    return toStatusDto(updatedStatus)
  }

  async delete(id: number) {
    ParamsValidation.validateId(id)
    await this.statusRepository.delete(id)
  }
}
