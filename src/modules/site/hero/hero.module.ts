import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hero } from './entities/hero.entity';
import { HeroTranslation } from './entities/hero-translation.entity';
import { HeroService } from './hero.service';
import { HeroController } from './hero.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hero, HeroTranslation])],
  controllers: [HeroController],
  providers: [HeroService],
  exports: [HeroService],
})
export class HeroModule {}
