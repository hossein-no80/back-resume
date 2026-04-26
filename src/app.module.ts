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
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { SkillModule } from './modules/skill/skill.module';
import { AboutModule } from './modules/about/about.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { BlogModule } from './modules/blog/blog.module';
import * as path from 'node:path';

@Module({
  imports: [
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
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'HosseiN545688@+',
      database: 'back_resume',
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
    // TypeOrmModule.forFeature([UserEntity]),
    // UsersModule,
    // AuthModule,
    // ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
