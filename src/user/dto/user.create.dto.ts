import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsStrongPassword
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Логин', example: 'user1' })
  login: string

  @IsString()
  @IsNotEmpty()
  //@IsStrongPassword
  @ApiProperty({ description: 'Пароль', example: '123' })
  password: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Полное имя',
    example: 'Юзеров Юзер Юзерович'
  })
  fullName: string

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Электронная почта',
    example: 'user1@maksoft.ru'
  })
  email: string
}
