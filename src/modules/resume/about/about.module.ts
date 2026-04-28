import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { About } from './entities/about.entity';
import { AboutTranslation } from './entities/about-translation.entity';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { ExperienceModule } from '../experience/experience.module';
import { InterestModule } from '../interest/interest.module';
import { SkillModule } from '../skill/skill.module';
import { Experience } from '../experience/entities/experience.entity';
import { Interest } from '../interest/entities/interest.entity';
import { Skill } from '../skill/entities/skill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      About,
      AboutTranslation,
      Experience,
      Interest,
      Skill,
    ]),
    ExperienceModule,
    InterestModule,
    SkillModule,
  ],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}
