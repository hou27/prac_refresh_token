import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  CreateAccountBodyDto,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginBodyDto, LoginOutput } from '../auth/dtos/login.dto';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // @Get()
  // userRootQuery() {
  //   return 'user controller';
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyInfo(@Req() req: Request) {
    return req.user;
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

  @Post('logout')
  logout() {
    return;
  }
}
