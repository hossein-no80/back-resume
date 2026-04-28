// src/modules/skill/skill.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { SkillTranslation } from './entities/skill-translation.entity';
import { SkillService } from './skill.service';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, SkillTranslation])],
  providers: [SkillService],
  exports: [SkillService],
})
export class SkillModule {}