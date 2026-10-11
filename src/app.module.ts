import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'node:path';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AboutSeeder } from './database/seeder/about.seeder';
import { About } from './modules/about/entities/about.entity';
import { AboutTranslation } from './modules/about/entities/about-translation.entity';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/admin/users/users.module';
import { AuthModule } from './modules/admin/auth/auth.module';
import { AboutModule } from './modules/about/about.module';
import { BlogModule } from './modules/blog/blog.module';
import { ContactModule } from './modules/contact/contact.module';
import { SeederService } from './database/seeder/seeder.service';
import UserEntity from './modules/admin/users/entities/user.entity';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { HeroModule } from './modules/site/hero/hero.module';

@Module({
  imports: [
    // 1. تنظیمات ماژول محیطی (بارگذاری فایل .env)
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }),

    // 2. Rate Limiting
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 1 دقیقه
          limit: 100, // حداکثر 100 درخواست در دقیقه
        },
      ],
    }),

    // 3. Cache Module با Redis
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
          },
          ttl: parseInt(process.env.CACHE_TTL || '300'), // 5 دقیقه
        }),
      }),
    }),

    // 4. تنظیمات ایمیل (Mailer)
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
          port: configService.get<number>('SMTP_PORT', 587),
          secure: configService.get<boolean>('SMTP_SECURE', false),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"${configService.get<string>('FROM_NAME', 'My Site')}" <${configService.get<string>('FROM_EMAIL', 'noreply@mysite.com')}>`,
        },
        template: {
          dir: path.join(__dirname, 'templates'),
          options: { strict: true },
        },
      }),
      inject: [ConfigService],
    }),

    // 5. تنظیمات دیتابیس (TypeORM)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production', // فقط در محیط development
        maxQueryExecutionTime: 1000,
        logging:
          process.env.NODE_ENV === 'development' ? ['error', 'warn'] : false,
        extra: {
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        },
        // اضافه کردن SSL برای production
        ...(process.env.NODE_ENV === 'production' && {
          ssl: {
            rejectUnauthorized: false,
          },
        }),
      }),
      inject: [ConfigService],
    }),

    // 6. تنظیمات بین‌المللی (i18n)
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: process.env.NODE_ENV === 'development',
      },
      resolvers: [
        new HeaderResolver(['x-custom-lang']),
        new QueryResolver(['lang']),
        new AcceptLanguageResolver(),
      ],
    }),

    // 7. رجیستر کردن موجودیت User برای استفاده در سرویس Seeder
    TypeOrmModule.forFeature([UserEntity, About, AboutTranslation]),

    // 8. ماژول‌های کاربردی برنامه
    UsersModule,
    AuthModule,
    AboutModule,
    BlogModule,
    ContactModule,
    HeroModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeederService,
    AboutSeeder,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
