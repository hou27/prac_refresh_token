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

  async findByName(name: string): Promise<FindUserOutput> {
    try {
      const user = await this.users.findOne(
        { name },
        { select: ['password', 'id', 'name'] },
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
