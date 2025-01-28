import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryRepository } from './category/category.repository';
import { DrizzleModule } from './db/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleService } from './db/drizzle.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from './auth/auth.roleGuard';

@Module({
  imports: [DrizzleModule, ConfigModule.forRoot( { isGlobal:true } )],
  controllers: [AppController, AuthController, CategoryController],
  providers: [
    AppService, 
    DrizzleService, 
    JwtService,
    AuthService, 
    RolesGuard,
    UserService, 
    UserRepository, 
    CategoryService, 
    CategoryRepository
  ],
})
export class AppModule {}
