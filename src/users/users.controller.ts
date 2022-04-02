import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  CreateAccountBodyDto,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginBodyDto } from './dtos/login.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  userRootQuery() {
    return 'user controller';
  }

  @Get()
  async getMyInfo() {}

  @Post()
  async register(
    @Body() createAccountBody: CreateAccountBodyDto,
  ): Promise<CreateAccountOutput> {
    console.log(createAccountBody);
    return this.usersService.register(createAccountBody);
  }

  @Post('login')
  logIn(@Body() loginBody: LoginBodyDto) {
    return this.usersService.login(loginBody);
  }

  @Post('logout')
  logOut() {
    return;
  }
}
