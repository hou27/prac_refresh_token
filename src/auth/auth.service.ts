import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginBodyDto, LogintOutput } from './dtos/login.dto';
import { ValidateUserDto, ValidateUserOutput } from './dtos/validate-user.dto';
import { Payload } from './jwt/jwt.payload';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async jwtLogin({ name, password }: LoginBodyDto): Promise<LogintOutput> {
    try {
      const validateUserResult = await this.validateUser({ name, password });
    } catch (error) {
      return { ok: false, error };
    }
  }

  async validateUser({
    name,
    password,
  }: ValidateUserDto): Promise<ValidateUserOutput> {
    try {
      const user = await this.usersService.findByName(name);
      if (!user) {
        throw new UnauthorizedException('User Not Found');
      }

      const isPasswordCorrect = await user.checkPassword(password);
      if (isPasswordCorrect) {
        return { ok: true };
      } else {
        return { ok: false, error: 'Wrong Password' };
      }
    } catch (error) {
      return { ok: false, error };
    }
  }
}
