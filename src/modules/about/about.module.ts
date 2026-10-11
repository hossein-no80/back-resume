import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { About } from './entities/about.entity';
import { AboutTranslation } from './entities/about-translation.entity';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { AboutSeeder } from '../../database/seeder/about.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([About, AboutTranslation])],
  controllers: [AboutController],
  providers: [AboutService, AboutSeeder],
  exports: [AboutService],
})
export class AboutModule {}
