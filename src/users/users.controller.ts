import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
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
import { Response } from 'express';
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
  async login(
    @Body() loginBody: LoginBodyDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginOutput> {
    const { ok, error, access_token } = await this.authService.jwtLogin(
      loginBody,
    );
    if (ok) {
      // res.cookie('access_token', access_token, { httpOnly: true }); // 프론트와 도메인이 달라 불가능
      return { ok, access_token };
    } else {
      return { ok, error };
    }
  }
}
