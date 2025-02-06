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
import { CategoryRepository } from "../category/category.repository";
import { StatusRepository } from "../status/status.repository";
import { UserRepository } from "../user/user.repository";

@Injectable()
export class TaskService {
    constructor(private taskRepository: TaskRepository,
        private categoryRepository: CategoryRepository,
        private statusRepository: StatusRepository,
        private userRepository: UserRepository,
    ) {}

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
        if (await this.categoryRepository.getById(createTaskDto.categoryId) == null) {
            throw new NotFoundException(`Не найдена категория с идентификатором ${createTaskDto.categoryId}`);
        } 
        if (await this.statusRepository.getById(createTaskDto.statusId) == null) {
            throw new NotFoundException(`Не найден статус с идентификатором ${createTaskDto.statusId}`);
        } 
        if (await this.userRepository.findById(createTaskDto.userId) == null) {
            throw new NotFoundException(`Не найден пользователь с идентификатором ${createTaskDto.userId}`);
        } 
        let newTask = await this.taskRepository.create(createTaskDto);
        return toTaskDto(newTask);
    } 

    async update(id: number, updateTaskDto: UpdateTaskDto, userInfo) : Promise<TaskDto> {
        ParamsValidation.validateId(id);
        if (await this.taskRepository.getById(id) == null) {
            throw new NotFoundException(`Не найдена задача с идентификатором ${id}`);
        }
        if (await this.categoryRepository.getById(updateTaskDto.categoryId) == null) {
            throw new NotFoundException(`Не найдена категория с идентификатором ${updateTaskDto.categoryId}`);
        } 
        if (await this.statusRepository.getById(updateTaskDto.statusId) == null) {
            throw new NotFoundException(`Не найден статус с идентификатором ${updateTaskDto.statusId}`);
        } 
        if (await this.userRepository.findById(updateTaskDto.userId) == null) {
            throw new NotFoundException(`Не найден пользователь с идентификатором ${updateTaskDto.userId}`);
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