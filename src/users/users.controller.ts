import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateAccountBodyDto,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import {
  LoginBodyDto,
  LoginOutput,
  LogoutOutput,
} from '../auth/dtos/login.dto';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Response } from 'express';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from './entities/user.entity';
import { RefreshTokenDto, RefreshTokenOutput } from 'src/auth/dtos/token.dto';

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

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@AuthUser() user: User): Promise<LogoutOutput> {
    return await this.usersService.logout(user.id);
  }

  @Post('token')
  async regenerateToken(
    @Body() regenerateBody: RefreshTokenDto,
  ): Promise<RefreshTokenOutput> {
    return await this.authService.regenerateToken(regenerateBody);
  }
}
