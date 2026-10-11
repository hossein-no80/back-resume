import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hero } from './entities/hero.entity';
import { HeroTranslation } from './entities/hero-translation.entity';
import { HeroService } from './hero.service';
import { HeroController } from './hero.controller';
import { HeroSeeder } from '../../../database/seeder/hero.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Hero, HeroTranslation])],
  controllers: [HeroController],
  providers: [HeroService, HeroSeeder],
  exports: [HeroService],
})
export class HeroModule {}
