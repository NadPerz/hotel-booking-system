// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from 'src/shared/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ FIXED: Add all the headers your frontend sends
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization',
      // ✅ Add these missing headers that your frontend sends
      'x-user-id',
      'X-User-Login', 
      'x-branch-id',
      'x-business-account-id',
      'x-user-first-name',
      'x-user-last-name',
      'x-user-type'
    ],
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();