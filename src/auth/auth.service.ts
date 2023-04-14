import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/schema/users.schema';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}
  async SignUpPost(signUpDto: SignUpDto) {
    const user: Users = {
      email: signUpDto.email,
      hashedPassword: await argon2.hash(signUpDto.password),
    };
    const res = await this.usersService.CreateUser(user);
    return `ok${JSON.stringify(res)}`;
  }

  async Login(login: LoginDto) {
    try {
      const user = await this.usersService.findOneByEmail({
        email: login.email,
      });
      const verify = await argon2.verify(user.hashedPassword, login.password);
      if (!user || !verify)
        throw new UnauthorizedException('Invalid credentials');
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        this.configService.get<string>('SECRET_KEY'),
        { expiresIn: '1h' },
      );
      return {
        email: user.email,
        token: token,
        userId: user._id,
      };
    } catch (error) {
      throw new UnauthorizedException({
        message: error.message,
      });
    }
  }
}
