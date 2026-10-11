import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { SkillCategory } from './entities/skill-category.entity';
import { SkillCategoryTranslation } from './entities/skill-category-translation.entity';
import { SkillItem } from './entities/skill-item.entity';
import { SkillItemTranslation } from './entities/skill-item-translation.entity';
import { SkillsSeeder } from '../../database/seeder/skills.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SkillCategory,
      SkillCategoryTranslation,
      SkillItem,
      SkillItemTranslation,
    ]),
  ],
  controllers: [SkillsController],
  providers: [SkillsService, SkillsSeeder],
  exports: [SkillsService],
})
export class SkillsModule {}
