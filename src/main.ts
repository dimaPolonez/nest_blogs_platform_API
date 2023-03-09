import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { PORT_CONFIGURATION } from './configuration';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(PORT_CONFIGURATION.PORT_DEV);
  console.log(`Start server on ${process.env.PORT} port`);
}
bootstrap();
