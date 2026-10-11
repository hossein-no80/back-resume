import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';
import { Experience } from './entities/experience.entity';
import { ExperienceTranslation } from './entities/experience-translation.entity';
import { ExperienceSeeder } from '../../database/seeder/experience.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Experience, ExperienceTranslation])],
  controllers: [ExperienceController],
  providers: [ExperienceService, ExperienceSeeder],
  exports: [ExperienceService],
})
export class ExperienceModule {}
