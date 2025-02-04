import { UserDto } from "./dto/user.dto";
import { UserPersistType } from "./user.persistType";

export const toUserDto = (data: UserPersistType): UserDto => {
  const { id, login, fullName, email, role} = data;

  const userDto: UserDto = {
    id,
    login, 
    fullName, 
    email, 
    role: role as 'ADMIN'|'USER'
  };

  return userDto;
};