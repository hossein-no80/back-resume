import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import type { Request } from 'express';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createPortfolioDto: CreatePortfolioDto) {
    return this.portfolioService.create(createPortfolioDto);
  }

  @Get()
  async findAll(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const language = lang || acceptLanguage?.split(',')[0] || 'en';
    return this.portfolioService.findAll(language, true);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('lang') lang?: string,
    @Req() req?: Request,
  ) {
    const acceptLanguage = req?.headers['accept-language'];
    const language = lang || acceptLanguage?.split(',')[0] || 'en';
    return this.portfolioService.findOne(id, language, true);
  }

  @Get('public')
  async findAllPublic(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const language = lang || acceptLanguage?.split(',')[0] || 'en';
    return this.portfolioService.findAll(language, false);
  }

  @Get('public/:id')
  async findOnePublic(
    @Param('id') id: string,
    @Query('lang') lang?: string,
    @Req() req?: Request,
  ) {
    const acceptLanguage = req?.headers['accept-language'];
    const language = lang || acceptLanguage?.split(',')[0] || 'en';
    return this.portfolioService.findOne(id, language, false);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ) {
    return this.portfolioService.update(id, updatePortfolioDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.portfolioService.remove(id);
  }
}
