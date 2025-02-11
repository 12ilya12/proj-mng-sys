import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class DependencyDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Идентификатор зависимости',
    example: '3'
  })
  id: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Идентификатор родительской задачи',
    example: '11'
  })
  parentTaskId: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Идентификатор дочерней задачи',
    example: '12'
  })
  childTaskId: number
}
