import { Body, Controller, Delete, Get, Param, Patch, Post, Query, SetMetadata, UseGuards, Request, ConflictException } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskDto } from "./dto/task.dto";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { RolesGuard } from "../auth/auth.roleGuard";
import { CreateTaskDto } from "./dto/task.create.dto";
import { UpdateTaskDto } from "./dto/task.update.dto";
import { TaskFilterDto } from "./dto/task.filter.dto";

@Controller('tasks')
@UseGuards(RolesGuard)
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get()
    getAll(@Query() pagingOptions: Partial<IPagingOptions>, @Body() filter : TaskFilterDto, @Request() req): Promise<IPaging<TaskDto>> {
        //TODO: Валидация pagingOption
        return this.taskService.getAll(pagingOptions, filter, req.user);
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
    @SetMetadata('roles', ['ADMIN', 'USER'])
    update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto, @Request() req) : Promise<TaskDto> {
        let updatedTask = this.taskService.update(id, updateTaskDto, req.user);
        return updatedTask;
    }

    @Delete(':id')
    @SetMetadata('roles', ['ADMIN'])
    async delete(@Param('id') id: number) {
        await this.taskService.delete(id);
    }
}