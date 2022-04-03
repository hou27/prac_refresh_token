import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { LoginBodyDto, LoginOutput } from './dtos/login.dto';
import { RefreshTokenDto, RefreshTokenOutput } from './dtos/token.dto';
import { ValidateUserDto, ValidateUserOutput } from './dtos/validate-user.dto';
import { Payload } from './jwt/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async jwtLogin({ name, password }: LoginBodyDto): Promise<LoginOutput> {
    try {
      const {
        ok,
        user: userWithPassword,
        error,
      } = await this.validateUser({ name, password });
      const { user } = await this.usersService.findById(userWithPassword.id);
      if (ok) {
        const payload: Payload = { name, sub: user.id };
        const refreshToken = await this.jwtService.sign(payload, {
          secret: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
          expiresIn: '1h',
        });
        user.refresh_token = refreshToken;
        console.log('chk here ::: ', user);
        await this.users.save(user);
        return {
          ok: true,
          access_token: this.jwtService.sign(payload),
          refresh_token: refreshToken,
        };
      } else {
        console.log('a', error);
        return { ok: false, error };
      }
    } catch (error) {
      console.log(error);
      return { ok: false, error };
    }
  }

  async regenerateToken({
    refresh_token,
  }: RefreshTokenDto): Promise<RefreshTokenOutput> {
    try {
      // decoding refresh token
      const decoded = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
      });
      console.log(decoded);

      const { ok, user, error } = await this.usersService.findById(
        decoded['sub'],
      );
      if (ok) {
        const name = user.name,
          sub = user.id;
        const payload: Payload = { name, sub };
        const newRefreshToken = this.jwtService.sign(payload, {
          secret: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
        });

        await this.users.save([
          { id: user.id, refresh_token: newRefreshToken },
        ]);

        return {
          ok: true,
          access_token: this.jwtService.sign(payload),
          refresh_token: newRefreshToken,
        };
      } else {
        return { ok: false, error };
      }
    } catch (error) {
      console.log(error);
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
