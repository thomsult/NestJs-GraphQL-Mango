import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable, Inject } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(@Inject(UsersService) private usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${
        process.env.FRONTEND_URL || `http://localhost:${process.env.PORT}`
      }/auth/google/redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      provider: 'google',
      providerId: profile.id,
      accessToken,
    };
    try {
      const userCreated = await this.usersService.FindOrCreateUserExt(user);
      if (userCreated) {
        return done(null, userCreated);
      }
    } catch (error) {
      return done(error, false);
    }
  }
}
