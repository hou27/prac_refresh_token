import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountBodyDto,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginBodyDto, LogintOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async register({
    name,
    password,
  }: CreateAccountBodyDto): Promise<CreateAccountOutput> {
    try {
      const user = await this.users.findOne({ name });

      if (user) {
        throw new UnauthorizedException('Already exist');
      }

      const result = await this.users.save({ name, password });
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async login({ name, password }: LoginBodyDto): Promise<LogintOutput> {
    try {
    } catch (error) {
      return { ok: false, error };
    }
  }
}
