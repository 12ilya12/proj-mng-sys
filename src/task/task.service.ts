import { Injectable } from "@nestjs/common";
import { TaskDto } from "./dto/task.dto";
import { TaskRepository } from "./task.repository";
import { IPagingOptions } from "src/pagination/pagination";
import { toTaskDto, toTaskDtoArray } from "./task.mapper";
import { CreateTaskDto } from "./dto/task.create.dto";
import { UpdateTaskDto } from "./dto/task.update.dto";
import { TaskFilterDto } from "./dto/task.filter.dto";
import { TaskPersistType } from "./task.persistType";

@Injectable()
export class TaskService {
    constructor(private taskRepository: TaskRepository) {}

    async getAll(pagingOptions: Partial<IPagingOptions>, filter: TaskFilterDto, userInfo): Promise<TaskDto[]> {
        let result = await this.taskRepository.getAll(pagingOptions, filter, userInfo);
        //TODO: Нужно ли возвращать result.pagination?
        return toTaskDtoArray(result.items);
    }

    async getById(id: number) : Promise<TaskDto> {
        let task = await this.taskRepository.getById(id);
        return toTaskDto(task);
    }

    async create(createTaskDto: CreateTaskDto): Promise<TaskDto> {
        let newTask = await this.taskRepository.create(createTaskDto);
        return toTaskDto(newTask);
    } 

    async update(id: number, updateTaskDto: UpdateTaskDto, userInfo) : Promise<TaskDto> {
        let updatedTask: TaskPersistType;
        if (userInfo.role === "ADMIN")
            updatedTask = await this.taskRepository.update(id, updateTaskDto);
        if (userInfo.role === "USER")
            updatedTask = await this.taskRepository.updateStatus(id, updateTaskDto.statusId, userInfo.id);
        return toTaskDto(updatedTask);
    }

    async delete(id: number) {
        this.taskRepository.delete(id);
    }
}