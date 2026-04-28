// src/modules/experience/experience.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { ExperienceTranslation } from './entities/experience-translation.entity';
import { ExperienceService } from './experience.service';

@Module({
  imports: [TypeOrmModule.forFeature([Experience, ExperienceTranslation])],
  providers: [ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}