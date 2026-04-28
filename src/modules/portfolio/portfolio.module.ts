import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioTranslation } from './entities/portfolio-translation.entity';
import { PortfolioImage } from './entities/portfolio-image.entity';
import { Skill } from '../resume/skill/entities/skill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Portfolio,
      PortfolioTranslation,
      PortfolioImage,
      Skill,
    ]),
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
