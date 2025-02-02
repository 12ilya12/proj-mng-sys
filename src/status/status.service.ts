import { Injectable } from "@nestjs/common";
import { StatusDto } from "./dto/status.dto";
import { StatusRepository } from "./status.repository";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { toStatusDto, toStatusDtoArray } from "./status.mapper";
import { CreateStatusDto } from "./dto/status.create.dto";
import { UpdateStatusDto } from "./dto/status.update.dto";

@Injectable()
export class StatusService {
    constructor(private statusRepository: StatusRepository) {}

    async getAll(pagingOptions: Partial<IPagingOptions>): Promise<IPaging<StatusDto>> {
        let result = await this.statusRepository.getAll(pagingOptions);
        let statuses = toStatusDtoArray(result.items);
        return { items: statuses, pagination: result.pagination };
    }

    async getById(id: number) : Promise<StatusDto> {
        let status = await this.statusRepository.getById(id);
        return toStatusDto(status);
    }

    async create(createStatusDto: CreateStatusDto): Promise<StatusDto> {
        let newStatus = await this.statusRepository.create(createStatusDto);
        return toStatusDto(newStatus);
    } 

    async update(id: number, updateStatusDto: UpdateStatusDto) : Promise<StatusDto> {
        let updatedStatus = await this.statusRepository.update(id, updateStatusDto);
        return toStatusDto(updatedStatus);
    }

    async delete(id: number) {
        this.statusRepository.delete(id);
    }
}