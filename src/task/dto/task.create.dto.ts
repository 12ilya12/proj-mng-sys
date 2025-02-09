import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsNotEmpty, IsNumberString, IsString } from "class-validator"

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Название задачи', example: 'Валидация входных параметров' })
    name: string;
    
    @IsString()
    @ApiProperty({ description: 'Описание задачи', example: 'Реализовать валидацию входных параметров запроса с помощью class-validator' })
    description: string;
    
    @IsNumberString()
    @ApiProperty({ description: 'Идентификатор категории задачи', example: '5' })
    categoryId: number;
    
    @IsNumberString()
    @ApiProperty({ description: 'Идентификатор статуса задачи', example: '1' })
    statusId: number;
    
    @IsNumberString()
    @ApiProperty({ description: 'Идентификатор пользователя, ответственного за задачу', example: '2' })
    userId: number;

    @IsISO8601( {strict: true} )
    @ApiProperty({ description: 'Дата выполнения задачи', example: '2025-02-15' })
    deadline: Date

    @IsNumberString()
    @ApiProperty({ description: 'Приоритет задачи', example: '2' })
    priority: number;
}