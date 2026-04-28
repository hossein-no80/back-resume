// about.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AboutService } from './about.service';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import type { Request } from 'express';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createOrUpdate(@Body() createAboutDto: CreateAboutDto) {
    return this.aboutService.createOrUpdate(createAboutDto);
  }

  @Get()
  async findOne(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const language = lang || acceptLanguage?.split(',')[0] || 'fa';
    return this.aboutService.getAbout(language);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  update(@Body() updateAboutDto: UpdateAboutDto) {
    return this.aboutService.update(updateAboutDto);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  remove() {
    return this.aboutService.remove();
  }
}
