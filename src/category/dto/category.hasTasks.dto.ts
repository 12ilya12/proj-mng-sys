import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty } from 'class-validator'

export class CategoryHasTasksDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Наличие задач, связанных с категорией',
    example: 'true'
  })
  hasTasks: boolean
}
