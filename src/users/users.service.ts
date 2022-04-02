import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountBodyDto,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginBodyDto, LogintOutput } from '../auth/dtos/login.dto';
import { User } from './entities/user.entity';
import { catchError } from 'rxjs';

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
      return { ok: false, error: 'Fail in register' };
    }
  }

  async login({ name, password }: LoginBodyDto): Promise<LogintOutput> {}

  async findByName(name: string): Promise<User> {
    try {
      const user = await this.users.findOne({ name });
      if (!user) {
        throw new UnauthorizedException('User Not Found');
      }

      return user;
    } catch (error) {
      throw new HttpException('Error', 403);
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.users.findOne({ id });
      if (!user) {
        throw new UnauthorizedException('User Not Found');
      }

      return user;
    } catch (error) {
      throw new HttpException('Error', 403);
    }
  }
}
