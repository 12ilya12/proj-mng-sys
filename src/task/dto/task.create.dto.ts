import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateTaskDto {
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
}