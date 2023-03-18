import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import cookieParser from 'cookie-parser';
import { CONFIG } from './config/config';
import { validatePipeOptions } from './helpers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe(validatePipeOptions));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(CONFIG.PORT);
  console.log(`Start server on ${CONFIG.PORT} port`);
}
bootstrap();
