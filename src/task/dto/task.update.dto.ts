import { IsISO8601, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

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

    @IsISO8601( {strict: true} )
    @IsOptional()
    deadline: Date
        
    @IsNumberString()
    @IsOptional()
    priority: number;
}
