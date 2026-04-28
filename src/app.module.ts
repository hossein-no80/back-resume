import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from './auth/auth.module';
// import { ProductsModule } from './products/products.module';
// import UserEntity from './users/entities/user.entity';

import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { UsersModule } from './modules/admin/users/users.module';
import { AuthModule } from './modules/admin/auth/auth.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { SkillModule } from './modules/resume/skill/skill.module';
import { AboutModule } from './modules/resume/about/about.module';
import { ExperienceModule } from './modules/resume/experience/experience.module';
import { BlogModule } from './modules/blog/blog.module';
import { InterestModule } from './modules/resume/interest/interest.module';
import { ContactModule } from './modules/contact/contact.module';
import * as path from 'node:path';
import UserEntity from './modules/admin/users/entities/user.entity';
import { SeederService } from './database/seeder/seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'HosseiN545688@+',
      database: process.env.DB_DATABASE || 'back_resume',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

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
