import { Body, Controller, Delete, Get, Param, Patch, Post, Query, SetMetadata, UseGuards } from "@nestjs/common";
import { StatusService } from "./status.service";
import { StatusDto } from "./dto/status.dto";
import { IPagingOptions } from "../pagination/pagination";
import { RolesGuard } from "../auth/auth.roleGuard";
import { CreateStatusDto } from "./dto/status.create.dto";
import { UpdateStatusDto } from "./dto/status.update.dto";

@Controller('statuses')
@UseGuards(RolesGuard)
export class StatusController {
    constructor(private statusService: StatusService) {}

    @Get()
    getAll(@Query() pagingOptions: Partial<IPagingOptions>): Promise<StatusDto[]> {
        //TODO: Валидация pagingOption
        return this.statusService.getAll(pagingOptions);
    }

    @Get(':id')
    getById(@Param('id') id: number) : Promise<StatusDto> {
        return this.statusService.getById(id);
    }

    @Post()
    @SetMetadata('roles', ['ADMIN'])
    create(@Body() createStatusDto: CreateStatusDto) : Promise<StatusDto> {
        let newStatus = this.statusService.create(createStatusDto);
        return newStatus;
    }

    @Patch(':id')
    @SetMetadata('roles', ['ADMIN'])
    update(@Param('id') id: number, @Body() updateStatusDto: UpdateStatusDto) : Promise<StatusDto> {
        let updatedStatus = this.statusService.update(id, updateStatusDto);
        return updatedStatus;
    }

    @Delete(':id')
    @SetMetadata('roles', ['ADMIN'])
    delete(@Param('id') id: number) {
        this.statusService.delete(id);
    }

}