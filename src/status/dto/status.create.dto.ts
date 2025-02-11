import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateStatusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Название статуса', example: 'New' })
  name: string
}
