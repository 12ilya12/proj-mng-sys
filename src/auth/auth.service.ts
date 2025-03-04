import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { CreateUserDto } from '../user/dto/user.create.dto'
import { LoginUserDto } from '../user/dto/user.login.dto'
import { RegistrationStatus } from './registrationStatus'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(
    userDto: CreateUserDto
  ): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered'
    }

    try {
      await this.userService.create(userDto)
    } catch (err) {
      status = {
        success: false,
        message: err
      }
    }

    return status
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.findByLogin(loginUserDto)
    const dataForToken = { id: user.id, role: user.role }
    const token = this.jwtService.signAsync(dataForToken, {
      secret: process.env.JWT_SECRET
    })
    return token
  }
}
