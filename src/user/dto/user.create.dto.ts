import { IsNotEmpty, IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  //@IsStrongPassword
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;
  
  @IsEmail()
  @IsNotEmpty()
  email: string;
}