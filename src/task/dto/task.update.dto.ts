import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class UpdateTaskDto {
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

    @IsDate()
    @Type(() => Date)
    deadline: Date
        
    @IsNumber()
    priority: number;
}