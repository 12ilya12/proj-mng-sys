import { IsNumber, IsOptional } from "class-validator"

export class TaskFilterDto {
    @IsNumber()
    @IsOptional()
    categoryId: number;
    
    @IsNumber()
    @IsOptional()
    statusId: number;

}