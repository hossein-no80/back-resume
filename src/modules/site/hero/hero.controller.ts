import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HeroService } from './hero.service';
import { UpsertHeroDto } from './dto/upsert-hero.dto';
import { DEFAULT_LANGUAGE } from '../../../common/constants';

@ApiTags('site-hero')
@Controller('site/hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  get(@Query('lang') lang?: string) {
    return this.heroService.getByLanguage(lang || DEFAULT_LANGUAGE);
  }

  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  getAll() {
    return this.heroService.getAll();
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  upsert(@Body() dto: UpsertHeroDto) {
    return this.heroService.upsert(dto);
  }
}