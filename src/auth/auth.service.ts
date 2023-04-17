import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup';
import { UsersService } from '../users/users.service';
import { Users } from '../users/schema/users.schema';
import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async SignUpPost(signUpDto: SignUpDto) {
    const user: Users = {
      email: signUpDto.email,
      hashedPassword: await argon2.hash(signUpDto.password),
    };
    const res = await this.usersService.CreateUser(user);
    return this.login({
      email: res.email,
      userId: String(res._id),
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findOneByEmail({ email });
      const verify = await argon2.verify(user.hashedPassword, password);
      if (user && verify) {
        return {
          email: user.email,
          userId: user._id,
        };
      }
    } catch (error) {
      throw new Error('Invalid credentials');
    }
    return null;
  }
  async login(user: { email: string; userId: string }) {
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
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return this.login(req.user);
  }

  async refreshToken(refreshToken: string) {
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
