import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogoutOutput } from 'src/auth/dtos/login.dto';
import { Repository } from 'typeorm';
import {
  CreateAccountBodyDto,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { FindUserOutput } from './dtos/find-user.dto';
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

      const result = await this.users.save(
        this.users.create({ name, password }),
      );
      console.log(result);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async logout(userId: number): Promise<LogoutOutput> {
    try {
      const user = await this.users.findOne({ id: userId });
      if (user) {
        user.refresh_token = null;
        await this.users.save(user);

        return { ok: true };
      } else {
        return { ok: false, error: 'Error in logout process' };
      }
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findByName(name: string): Promise<FindUserOutput> {
    try {
      const user = await this.users.findOne(
        { name },
        { select: ['id', 'name', 'password'] },
      );
      if (!user) {
        throw new UnauthorizedException('User Not Found with that name');
      }

      return { ok: true, user };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findById(id: number): Promise<FindUserOutput> {
    try {
      const user = await this.users.findOne({ id });
      if (!user) {
        throw new UnauthorizedException('User Not Found with that ID');
      }

      return { ok: true, user };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
