import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser()); // ✅ استفاده از cookie-parser
  app.use(session({ secret: process.env.SESSION_SECRET || 'secret' }));
  app.use(passport.initialize());
  app.use(passport.session());
  dotenv.config();

  const config = new DocumentBuilder()
    .setTitle('My products site')
    .setDescription('This is Products api documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token', // نام سکیوریتی (اختیاری)
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
