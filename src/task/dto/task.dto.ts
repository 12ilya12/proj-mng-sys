import { ApiProperty } from '@nestjs/swagger'
import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator'

export class TaskDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Идентификатор задачи', example: '12' })
  id: number

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Название задачи',
    example: 'Валидация входных параметров'
  })
  name: string

  @IsString()
  @ApiProperty({
    description: 'Описание задачи',
    example:
      'Реализовать валидацию входных параметров запроса с помощью class-validator'
  })
  description: string

  @IsNumber()
  @ApiProperty({
    description: 'Идентификатор категории задачи',
    example: '5'
  })
  categoryId: number

  @IsNumber()
  @ApiProperty({
    description: 'Идентификатор статуса задачи',
    example: '1'
  })
  statusId: number

  @IsNumber()
  @ApiProperty({
    description:
      'Идентификатор пользователя, ответственного за задачу',
    example: '2'
  })
  userId: number

  @IsISO8601({ strict: true })
  @ApiProperty({
    description: 'Дата выполнения задачи',
    example: '2025-02-15'
  })
  deadline: Date

  @IsNumber()
  @ApiProperty({ description: 'Приоритет задачи', example: '2' })
  priority: number
}
