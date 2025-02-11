import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CategoryDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Идентификатор', example: '1' })
  id: number

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Название категории', example: 'Bug' })
  name: string
}
