import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class TaskFilterDto {
    @IsNumber()
    categoryId: number;
    
    @IsNumber()
    statusId: number;

}