import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsISO8601,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString
} from 'class-validator'

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Название задачи',
    example: 'Валидация входных параметров'
  })
  name: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Описание задачи',
    example:
      'Реализовать валидацию входных параметров запроса с помощью class-validator'
  })
  description: string

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Идентификатор категории задачи',
    example: '5'
  })
  categoryId: number

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Идентификатор статуса задачи',
    example: '1'
  })
  statusId: number

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'Идентификатор пользователя, ответственного за задачу',
    example: '2'
  })
  userId: number

  @IsISO8601({ strict: true })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Дата выполнения задачи',
    example: '2025-02-15'
  })
  deadline: Date

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Приоритет задачи',
    example: '2'
  })
  priority: number
}
