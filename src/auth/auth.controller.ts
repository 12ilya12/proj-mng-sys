import { Body, Controller, HttpException, HttpStatus, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dto/user.create.dto";
import { LoginUserDto } from "../user/dto/user.login.dto";
import { RegistrationStatus } from "./registrationStatus";
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@Controller('auth')
@ApiTags('Аутентификация')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: "Зарегистрировать нового пользователя" })
  @ApiBody( {required: true, type: CreateUserDto} )
  @ApiCreatedResponse({ description: "Регистрация пользователя завершена", type: RegistrationStatus })
  @ApiBadRequestResponse({ description: "Некорректный запрос" })
  public async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(createUserDto);

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Post('login')
  @ApiOperation({ summary: "Авторизовать пользователя" })
  @ApiBody( {required: true, type: LoginUserDto} )
  @ApiCreatedResponse({ description: "Авторизация пользователя завершена", type: String })
  @ApiUnauthorizedResponse( {description: "Неверно введён логин или пароль"} )
  @ApiBadRequestResponse({ description: "Некорректный запрос" })
  public async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }
}