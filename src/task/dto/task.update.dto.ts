import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateTaskDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;
        
    @IsString()
    @IsOptional()
    description: string;
        
    @IsNumber()
    @IsOptional()
    categoryId: number;
        
    @IsNumber()
    @IsOptional()
    statusId: number;
        
    @IsNumber()
    @IsOptional()
    userId: number;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    deadline: Date
        
    @IsNumber()
    @IsOptional()
    priority: number;
}