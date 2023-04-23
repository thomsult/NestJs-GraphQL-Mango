import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthView } from './auth.view';
import { UsersModule } from '../users/users.module';
import { IsUserAlreadyExist } from './decorator/ifExist.decorator';
import { GoogleStrategy } from './strategy/google.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalController } from './controller/local.controller';
import { GoogleController } from './controller/google.controller';
import { JwtController } from './controller/jwt.controller';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [LocalController, GoogleController, JwtController],
  providers: [
    AuthService,
    AuthView,
    IsUserAlreadyExist,
    GoogleStrategy,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
