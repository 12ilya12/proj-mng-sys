import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator"

export class UpdateTaskDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;
        
    @IsString()
    @IsOptional()
    description: string;
        
    @IsNumberString()
    @IsOptional()
    categoryId: number;
        
    @IsNumberString()
    @IsOptional()
    statusId: number;
        
    @IsNumberString()
    @IsOptional()
    userId: number;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    deadline: Date
        
    @IsNumberString()
    @IsOptional()
    priority: number;
}
