import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Controller('user')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}
}
