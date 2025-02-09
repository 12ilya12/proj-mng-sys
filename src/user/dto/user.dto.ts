import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsNumber, IsString } from 'class-validator';

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Идентификатор пользователя', example: '12' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Логин', example: 'user1' })
  login: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Полное имя', example: 'Юзеров Юзер Юзерович' })
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Электронная почта', example: 'user1@maksoft.ru' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Роль пользователя', example: 'USER' })
  role: 'ADMIN'|'USER';
}