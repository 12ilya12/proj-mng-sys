import { Body, Controller, Get, Param, Post, Query, UseGuards, Request, Delete } from "@nestjs/common";
import { RolesGuard } from "../auth/auth.roleGuard";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { DependencyDto } from "./dto/dependency.dto";
import { DependencyService } from "./dependency.service";
import { CreateDependencyDto } from "./dto/dependency.create.dto";

@Controller('tasks/:taskId/dependencies')
@UseGuards(RolesGuard)
export class DependencyController {
    constructor(private dependencyService: DependencyService) {}

    @Get()
    getAll(@Param('taskId') taskId: number, @Query() pagingOptions: Partial<IPagingOptions>) : Promise<IPaging<DependencyDto>> {
        return this.dependencyService.getAll(taskId, pagingOptions);
    }

    @Post()
    create(@Param('taskId') taskId: number, @Body() createDependencyDto: CreateDependencyDto, @Request() req) : Promise<DependencyDto> {
        return this.dependencyService.create(taskId, createDependencyDto, req.user)
    }

    @Delete(':dependencyId')
    async delete(@Param('taskId') taskId: number, @Param('dependencyId') dependencyId: number) {
        await this.dependencyService.delete(taskId, dependencyId);
    }
}