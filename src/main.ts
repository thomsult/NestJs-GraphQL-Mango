import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const Port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:4200', 'http://localhost:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(Port, () => {
    console.log(`Server is running: http://localhost:${Port}`);
  });
}
bootstrap();
