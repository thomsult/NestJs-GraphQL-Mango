import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAuth, AuthLogin } from './auth.types';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async SignUpPost(signUpDto: SignUpDto): Promise<AuthLogin> {
    const user = {
      email: signUpDto.email,
      hashedPassword: await argon2.hash(signUpDto.password),
    };
    const res = await this.usersService.CreateUser(user);
    return this.login({
      email: res.email,
      userId: String(res.id),
    });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserAuth | null> {
    try {
      const user = await this.usersService.find({ where: { email } });
      const verify = await argon2.verify(user.hashedPassword, password);
      if (user && verify) {
        return {
          email: user.email,
          userId: user.id,
        };
      }
    } catch (error) {
      throw new Error('Invalid credentials');
    }
    return null;
  }

  async login(user: { email: string; userId: string }): Promise<AuthLogin> {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1h',
      }),
      refresh_token: this.jwtService.sign(
        {
          ...payload,
          refresh_token: true,
        },
        {
          expiresIn: '7d',
        },
      ),
    };
  }

  googleLogin(req): Promise<AuthLogin> | string {
    try {
      if (!req.user) {
        throw new UnauthorizedException('No user from google');
      }
      return this.login(req.user);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthLogin> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      if (!payload.refresh_token) {
        throw new UnauthorizedException();
      }
      return this.login({
        email: payload.email,
        userId: payload.sub,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
