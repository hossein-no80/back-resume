import { Module } from '@nestjs/common';
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

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/admin/users/users.module';
import { AuthModule } from './modules/admin/auth/auth.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { SkillModule } from './modules/resume/skill/skill.module';
import { AboutModule } from './modules/resume/about/about.module';
import { ExperienceModule } from './modules/resume/experience/experience.module';
import { BlogModule } from './modules/blog/blog.module';
import { InterestModule } from './modules/resume/interest/interest.module';
import { ContactModule } from './modules/contact/contact.module';
import { SeederService } from './database/seeder/seeder.service';
import UserEntity from './modules/admin/users/entities/user.entity';

@Module({
  imports: [
    // 1. تنظیمات ماژول محیطی (بارگذاری فایل .env)
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }),

    // 2. تنظیمات ایمیل (Mailer) - به صورت غیرهمزمان با ConfigService
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
          port: configService.get<number>('SMTP_PORT', 587),
          secure: false, // true برای پورت 465
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

    // 3. تنظیمات دیتابیس (TypeORM) - به صورت غیرهمزمان با ConfigService
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
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),

    // 4. تنظیمات بین‌المللی (i18n)
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new HeaderResolver(['x-custom-lang']),
        new QueryResolver(['lang']),
        new AcceptLanguageResolver(),
      ],
    }),

    // 5. رجیستر کردن موجودیت User برای استفاده در سرویس Seeder
    TypeOrmModule.forFeature([UserEntity]),

    // 6. ماژول‌های کاربردی برنامه
    UsersModule,
    AuthModule,
    PortfolioModule,
    SkillModule,
    AboutModule,
    ExperienceModule,
    BlogModule,
    InterestModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule {}