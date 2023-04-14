import {
  CanActivate,
  ExecutionContext,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class AuthGuard implements CanActivate {
  public token: jwt;
  async canActivate(ctx: ExecutionContext) {
    const VerifyToken = (token: string) => {
      // do something async
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return decoded;
      } catch (error) {
        throw new UnauthorizedException({
          message: 'Unauthorized token is missing or invalid',
        });
      }
    };
    try {
      const req = ctx.switchToHttp().getNext().req;
      const isAuthenticated = await new Promise<jwt>((resolve) => {
        const auth = req.headers.authorization.split(' ')[1];
        const token = VerifyToken(auth) as jwt;
        this.token = token;
        resolve(token);
      });
      req.user = isAuthenticated;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Unauthorized token is missing or invalid',
      });
    }
    return true;
  }
}

@Injectable()
export class TokenEmail implements PipeTransform {
  constructor(private authGuard: AuthGuard) {}
  transform(value: string) {
    if (value === undefined && this.authGuard.token.email) {
      const { email } = this.authGuard.token;
      return email;
    }
    return value;
  }
}
