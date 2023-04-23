import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
@Module({
  imports: [CommonModule, AuthModule, UsersModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
