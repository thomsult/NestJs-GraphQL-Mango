import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        const dbName = configService.get<string>('MONGO_DB_NAME');
        return { uri, dbName };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MongoModule {}
