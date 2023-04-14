import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class AuthGuard implements CanActivate {
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
        console.log(token);
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
