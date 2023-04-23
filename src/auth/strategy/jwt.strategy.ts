import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UsersService) private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: {
    email: string;
    sub: string;
    refresh_token?: string;
  }) {
    try {
      if (payload.refresh_token) return false;
      return await this.usersService
        .find({ where: { email: payload.email } })
        .then((user) => {
          user.hashedPassword = undefined;
          return user;
        });
    } catch (e) {
      return false;
    }
  }
}
