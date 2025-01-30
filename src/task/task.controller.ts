import { Body, Controller, Delete, Get, Param, Patch, Post, Query, SetMetadata, UseGuards } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskDto } from "./dto/task.dto";
import { IPagingOptions } from "../pagination/pagination";
import { RolesGuard } from "../auth/auth.roleGuard";
import { CreateTaskDto } from "./dto/task.create.dto";
import { UpdateTaskDto } from "./dto/task.update.dto";
import { TaskFilterDto } from "./dto/task.filter.dto";

@Controller('tasks')
@UseGuards(RolesGuard)
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get()
    getAll(@Query() pagingOptions: Partial<IPagingOptions>, @Body() filter : TaskFilterDto): Promise<TaskDto[]> {
        //TODO: Валидация pagingOption
        return this.taskService.getAll(pagingOptions);
    }

    @Get(':id')
    getById(@Param('id') id: number) : Promise<TaskDto> {
        return this.taskService.getById(id);
    }

    @Post()
    @SetMetadata('roles', ['ADMIN'])
    create(@Body() createTaskDto: CreateTaskDto) : Promise<TaskDto> {
        let newTask = this.taskService.create(createTaskDto);
        return newTask;
    }

    @Patch(':id')
    @SetMetadata('roles', ['ADMIN'])
    update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) : Promise<TaskDto> {
        let updatedTask = this.taskService.update(id, updateTaskDto);
        return updatedTask;
    }

    @Delete(':id')
    @SetMetadata('roles', ['ADMIN'])
    delete(@Param('id') id: number) {
        this.taskService.delete(id);
    }

}