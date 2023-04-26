// eslint-disable-next-line prettier/prettier
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async authenticate(req: Request) {
    const email = req.body.email;
    const password = req.body.password;
    this.validate(email, password)
      .then((user) => {
        if (!user) {
          throw new UnauthorizedException();
        }
        const { password, ...result } = user;
        req.user = result;
        return this.success(result);
      })
      .catch((err) => {
        this.fail(err);
      });
  }
  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  }
}
