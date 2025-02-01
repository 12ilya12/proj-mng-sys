import { Injectable } from "@nestjs/common";
import { DependencyDto } from "./dto/dependency.dto";
import { IPagingOptions } from "../pagination/pagination";
import { DependencyRepository } from "./dependency.repository";
import { toDependencyDto, toDependencyDtoArray } from "./dependency.mapper";
import { CreateDependencyDto } from "./dto/dependency.create.dto";

@Injectable()
export class DependencyService {
    constructor(private dependencyRepository: DependencyRepository) {}

    async getAll(parentTaskId: number, pagingOptions: Partial<IPagingOptions>): Promise<DependencyDto[]> {
        let result = await this.dependencyRepository.getAll(parentTaskId, pagingOptions);
        //TODO: Нужно ли возвращать result.pagination?
        return toDependencyDtoArray(result.items);
    }

    async create(parentTaskId: number, createDependencyDto : CreateDependencyDto, userInfo) : Promise<DependencyDto> {
        let newTask = await this.dependencyRepository.create(parentTaskId, createDependencyDto.childTaskId, userInfo);
        return toDependencyDto(newTask);
    }

    async delete(parentTaskId: number, dependencyId : number) {
        this.dependencyRepository.delete(parentTaskId, dependencyId);
    }
}