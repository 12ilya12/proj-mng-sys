import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserDto } from "./dto/user.dto";
import { CreateUserDto } from "./dto/user.create.dto";
import { compare, genSalt, hash } from "bcrypt";
import { LoginUserDto } from "./dto/user.login.dto";
import { UserPersistType } from "./user.persistType";
import { toUserDto } from "./user.mapper";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

    async findByLogin({ login, password }: LoginUserDto): Promise<UserDto> {
        const user : UserPersistType = await this.userRepository.findByLogin(login);
    
        if (!user) {
          throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }
    
        const areEqual = await compare(password, user.password);
    
        if (!areEqual) {
          throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
    
        return toUserDto(user);
    }

    async create(userDto: CreateUserDto): Promise<UserDto> {
        const { login, password, fullName, email } = userDto;
    
        const userInDb = await this.userRepository.findByLogin(login);
        if (userInDb) {
          throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
    
        const salt = await genSalt(12);
        const hashPassword = await hash(password, salt);
    
        const createUserDtoWithHash : CreateUserDto = {login, password: hashPassword, fullName, email};
        const newUser : UserPersistType = await this.userRepository.create(createUserDtoWithHash, "USER");
    
        //Клиенту отдаём данные без пароля
        return toUserDto(newUser);
    }
}