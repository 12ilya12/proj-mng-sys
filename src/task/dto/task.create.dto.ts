import { IsISO8601, IsNotEmpty, IsNumberString, IsString } from "class-validator"

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

    @IsISO8601( {strict: true} )
    deadline: Date

    @IsNumberString()
    priority: number;
}