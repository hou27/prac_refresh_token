import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  CreateAccountBodyDto,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginBodyDto, LoginOutput } from '../auth/dtos/login.dto';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @Get()
  userRootQuery() {
    return 'user controller';
  }

  @Get()
  async getMyInfo() {}

  @Post('register')
  async register(
    @Body() createAccountBody: CreateAccountBodyDto,
  ): Promise<CreateAccountOutput> {
    console.log(createAccountBody);
    return await this.usersService.register(createAccountBody);
  }

  @Post('login')
  async login(@Body() loginBody: LoginBodyDto): Promise<LoginOutput> {
    console.log(loginBody);
    const a = await this.authService.jwtLogin(loginBody);
    console.log(a);
    return a;
  }

  @Post('logout')
  logOut() {
    return;
  }
}
