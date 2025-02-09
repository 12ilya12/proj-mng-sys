import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional } from "class-validator"

export class TaskFilterDto {
    @IsNumberString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Идентификатор категории задачи', example: '5' })
    categoryId: number;
    
    @IsNumberString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Идентификатор статуса задачи', example: '1' })
    statusId: number;

}