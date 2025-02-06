import { Injectable } from "@nestjs/common";
import { DrizzleService } from "../db/drizzle.service";
import { eq } from 'drizzle-orm';
import { UserPersistType } from "./user.persistType";
import { userTable } from "../db/schema";
import { CreateUserDto } from "./dto/user.create.dto";

@Injectable()
export class UserRepository {
    constructor(private drizzle: DrizzleService) {}

    async findById(id: number) : Promise<UserPersistType> {
        let user = (await this.drizzle.db.select().from(userTable).where(eq(userTable.id, id)))[0];
        return user;
    }

    async findByLogin(login: string) : Promise<UserPersistType> {
        let user = (await this.drizzle.db.select().from(userTable).where(eq(userTable.login, login)))[0];
        return user;
    }

    async create(userInfo: CreateUserDto, role: string) : Promise<UserPersistType> {
        let newUser = (await this.drizzle.db.insert(userTable).values({
            login: userInfo.login,
            password: userInfo.password,
            fullName: userInfo.fullName,
            email: userInfo.email,
            role: role
        }).returning())[0];
        return newUser;
    }
}