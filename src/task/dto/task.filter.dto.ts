import { IsNumberString, IsOptional } from "class-validator"

export class TaskFilterDto {
    @IsNumberString()
    @IsOptional()
    categoryId: number;
    
    @IsNumberString()
    @IsOptional()
    statusId: number;

}