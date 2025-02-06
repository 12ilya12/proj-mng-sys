import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator"

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    description: string;
    
    @IsNumberString()
    categoryId: number;
    
    @IsNumberString()
    statusId: number;
    
    @IsNumberString()
    userId: number;

    @IsDate()
    @Type(() => Date)
    deadline: Date

    @IsNumberString()
    priority: number;
}