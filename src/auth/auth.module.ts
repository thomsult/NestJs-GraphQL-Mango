import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthView } from './auth.view';
import { UsersModule } from 'src/users/users.module';
import { IsUserAlreadyExist } from './decorator/ifExist.decorator';
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthView, IsUserAlreadyExist],
})
export class AuthModule {}
