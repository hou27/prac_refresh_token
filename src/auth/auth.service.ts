import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginBodyDto, LoginOutput } from './dtos/login.dto';
import { ValidateUserDto, ValidateUserOutput } from './dtos/validate-user.dto';
import { Payload } from './jwt/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async jwtLogin({ name, password }: LoginBodyDto): Promise<LoginOutput> {
    try {
      const { ok, user, error } = await this.validateUser({ name, password });
      if (ok) {
        const payload: Payload = { name, sub: user.id };
        return { ok: true, access_token: this.jwtService.sign(payload) };
      } else {
        return { ok: false, error };
      }
    } catch (error) {
      return { ok: false, error };
    }
  }

  async validateUser({
    name,
    password,
  }: ValidateUserDto): Promise<ValidateUserOutput> {
    try {
      const { user } = await this.usersService.findByName(name);
      if (!user) {
        throw new UnauthorizedException('User Not Found');
      }

      const isPasswordCorrect = await user.checkPassword(password);
      console.log(isPasswordCorrect);
      if (isPasswordCorrect) {
        return { ok: true, user };
      } else {
        return { ok: false, error: 'Wrong Password' };
      }
    } catch (error) {
      return { ok: false, error };
    }
  }
}
