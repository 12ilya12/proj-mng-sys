import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { DependencyDto } from './dto/dependency.dto'
import { IPaging, IPagingOptions } from '../pagination/pagination'
import { DependencyRepository } from './dependency.repository'
import {
  toDependencyDto,
  toDependencyDtoArray
} from './dependency.mapper'
import { CreateDependencyDto } from './dto/dependency.create.dto'
//import { ParamsValidation } from '../common/paramsValidation'
import { TaskRepository } from '../task/task.repository'

@Injectable()
export class DependencyService {
  constructor(
    private dependencyRepository: DependencyRepository,
    private taskRepository: TaskRepository
  ) {}

  async getAll(
    parentTaskId: number,
    pagingOptions: Partial<IPagingOptions>
  ): Promise<IPaging<DependencyDto>> {
    //ParamsValidation.validatePagingOptions(pagingOptions)
    let result = await this.dependencyRepository.getAll(
      parentTaskId,
      pagingOptions
    )
    let dependencies = toDependencyDtoArray(result.items)
    return { items: dependencies, pagination: result.pagination }
  }

  async create(
    parentTaskId: number,
    createDependencyDto: CreateDependencyDto,
    userInfo
  ): Promise<DependencyDto> {
    if ((await this.taskRepository.getById(parentTaskId)) == null) {
      throw new NotFoundException(
        `Не найдена задача с идентификатором ${parentTaskId}`
      )
    }
    if (
      (await this.taskRepository.getById(
        createDependencyDto.childTaskId
      )) == null
    ) {
      throw new NotFoundException(
        `Не найдена задача с идентификатором ${createDependencyDto.childTaskId}`
      )
    }
    if (parentTaskId == createDependencyDto.childTaskId) {
      throw new BadRequestException(
        'Нельзя связать задачу саму с собой'
      )
    }
    let newTask = await this.dependencyRepository.create(
      parentTaskId,
      createDependencyDto.childTaskId,
      userInfo
    )
    return toDependencyDto(newTask)
  }

  async delete(parentTaskId: number, dependencyId: number) {
    await this.dependencyRepository.delete(parentTaskId, dependencyId)
  }
}
