import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateAccountBodyDto,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginBodyDto, LoginOutput } from '../auth/dtos/login.dto';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from './entities/user.entity';

// @UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyInfo(@AuthUser() user: User): User {
    return user;
  }

  @Post('register')
  async register(
    @Body() createAccountBody: CreateAccountBodyDto,
  ): Promise<CreateAccountOutput> {
    console.log(createAccountBody);
    return await this.usersService.register(createAccountBody);
  }

  @Post('login')
  async login(@Body() loginBody: LoginBodyDto): Promise<LoginOutput> {
    return await this.authService.jwtLogin(loginBody);
  }
}
