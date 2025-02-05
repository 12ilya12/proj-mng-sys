import { Injectable } from "@nestjs/common";
import { DependencyDto } from "./dto/dependency.dto";
import { IPaging, IPagingOptions } from "../pagination/pagination";
import { DependencyRepository } from "./dependency.repository";
import { toDependencyDto, toDependencyDtoArray } from "./dependency.mapper";
import { CreateDependencyDto } from "./dto/dependency.create.dto";
import { ParamsValidation } from "../common/paramsValidation";

@Injectable()
export class DependencyService {
    constructor(private dependencyRepository: DependencyRepository) {}

    async getAll(parentTaskId: number, pagingOptions: Partial<IPagingOptions>): Promise<IPaging<DependencyDto>> {
        ParamsValidation.validateId(parentTaskId);
        ParamsValidation.validatePagingOptions(pagingOptions);
        let result = await this.dependencyRepository.getAll(parentTaskId, pagingOptions);
        let dependencies = toDependencyDtoArray(result.items)
        return { items: dependencies, pagination: result.pagination };
    }

    async create(parentTaskId: number, createDependencyDto : CreateDependencyDto, userInfo) : Promise<DependencyDto> {
        ParamsValidation.validateId(parentTaskId);
        let newTask = await this.dependencyRepository.create(parentTaskId, createDependencyDto.childTaskId, userInfo);
        return toDependencyDto(newTask);
    }

    async delete(parentTaskId: number, dependencyId : number) {
        ParamsValidation.validateId(parentTaskId);
        ParamsValidation.validateId(dependencyId);
        await this.dependencyRepository.delete(parentTaskId, dependencyId);
    }
}