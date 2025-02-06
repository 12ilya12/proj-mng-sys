import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { TaskDto } from "./dto/task.dto";
import { TaskRepository } from "./task.repository";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { toTaskDto, toTaskDtoArray } from "./task.mapper";
import { CreateTaskDto } from "./dto/task.create.dto";
import { UpdateTaskDto } from "./dto/task.update.dto";
import { TaskFilterDto } from "./dto/task.filter.dto";
import { TaskPersistType } from "./task.persistType";
import { ParamsValidation } from "../common/paramsValidation";

@Injectable()
export class TaskService {
    constructor(private taskRepository: TaskRepository) {}

    async getAll(pagingOptions: Partial<IPagingOptions>, filter: TaskFilterDto, userInfo): Promise<IPaging<TaskDto>> {
        ParamsValidation.validatePagingOptions(pagingOptions);
        let result = await this.taskRepository.getAll(pagingOptions, filter, userInfo);
        let tasks = toTaskDtoArray(result.items);
        return { items: tasks, pagination: result.pagination };
    }

    async getById(id: number) : Promise<TaskDto> {
        ParamsValidation.validateId(id);
        let task = await this.taskRepository.getById(id);
        if (task == null)
            throw new NotFoundException(`Не найдена задача с идентификатором ${id}`);
        return toTaskDto(task);
    }

    async create(createTaskDto: CreateTaskDto): Promise<TaskDto> {
        let newTask = await this.taskRepository.create(createTaskDto);
        return toTaskDto(newTask);
    } 

    async update(id: number, updateTaskDto: UpdateTaskDto, userInfo) : Promise<TaskDto> {
        ParamsValidation.validateId(id);
        if (await this.taskRepository.getById(id) == null) {
            throw new NotFoundException(`Не найдена задача с идентификатором ${id}`);
        }
        let updatedTask: TaskPersistType;
        if (userInfo.role === "ADMIN")
            updatedTask = await this.taskRepository.update(id, updateTaskDto);
        if (userInfo.role === "USER") {
            if (await this.taskRepository.taskForUser(id, userInfo.id)) {
                throw new ForbiddenException('Задача не связана с текущим пользователем');
            }
            updatedTask = await this.taskRepository.updateStatus(id, updateTaskDto.statusId, userInfo.id);
        }
        return toTaskDto(updatedTask);
    }

    async delete(id: number) {
        ParamsValidation.validateId(id);
        await this.taskRepository.delete(id);
    }
}