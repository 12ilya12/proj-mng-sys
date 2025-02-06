import { IsISO8601, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class TaskDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    categoryId: number;

    @IsNumber()
    statusId: number;

    @IsNumber()
    userId: number;

    @IsISO8601( {strict: true} )
    deadline: Date
    
    @IsNumber()
    priority: number;
}