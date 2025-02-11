import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Логин', example: 'user1' })
  readonly login: string

  @IsString()
  @IsNotEmpty()
  //@IsStrongPassword
  @ApiProperty({ description: 'Пароль', example: '123' })
  readonly password: string
}
