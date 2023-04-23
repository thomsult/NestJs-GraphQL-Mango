import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql.module';
import { ConfigModule } from './config.module';

@Module({
  imports: [ConfigModule, GraphqlModule],
  exports: [ConfigModule, GraphqlModule],
})
export class CommonModule {}
