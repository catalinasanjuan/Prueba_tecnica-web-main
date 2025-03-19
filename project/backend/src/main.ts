import * as dotenv from 'dotenv';
import { resolve  } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env') });
console.log('🔹 JWT_SECRET cargado:', process.env.JWT_SECRET);

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import "reflect-metadata";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.listen(3000);
}
bootstrap();