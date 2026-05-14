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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse, ApiOkResponse,
  ApiOperation, ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Portfolio } from './entities/portfolio.entity';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ایجاد پروژه جدید (فقط ادمین)' })
  @ApiBody({ type: CreatePortfolioDto })
  @ApiCreatedResponse({ type: Portfolio, description: 'پروژه با موفقیت ایجاد شد' })
  @ApiUnauthorizedResponse({ description: 'توکن نامعتبر است' })
  create(@Body() createPortfolioDto: CreatePortfolioDto) {
    return this.portfolioService.create(createPortfolioDto);
  }

  @Get()
  @ApiOperation({ summary: 'دریافت لیست پروژه‌ها (عمومی - فقط منتشر شده)' })
  @ApiQuery({
    name: 'lang',
    required: false,
    example: 'fa',
    description: 'کد زبان',
  })
  @ApiOkResponse({ type: [Portfolio] })
  async findAll(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const language = lang || acceptLanguage?.split(',')[0] || 'en';
    return this.portfolioService.findAll(language, true);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'دریافت جزئیات یک پروژه (عمومی - فقط در صورت منتشر شده بودن)',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'lang', required: false, example: 'fa' })
  @ApiOkResponse({ type: Portfolio })
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
  @ApiOperation({
    summary: 'لیست پروژه‌های عمومی (مشابه get all, فقط منتشر شده)',
  })
  @ApiOkResponse({ type: [Portfolio] })
  @ApiOperation({
    summary: 'لیست پروژه‌های عمومی (مشابه get all, فقط منتشر شده)',
  })
  @ApiOkResponse({ type: [Portfolio] })
  async findAllPublic(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const language = lang || acceptLanguage?.split(',')[0] || 'en';
    return this.portfolioService.findAll(language, false);
  }

  @Get('public/:id')
  @ApiOperation({ summary: 'جزئیات پروژه برای عموم (فقط منتشر شده)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: Portfolio })
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
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'به‌روزرسانی پروژه (ادمین)' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdatePortfolioDto })
  @ApiOkResponse({ type: Portfolio })
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ) {
    return this.portfolioService.update(id, updatePortfolioDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'حذف پروژه (ادمین)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'پروژه حذف شد' })
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.portfolioService.remove(id);
  }
}
