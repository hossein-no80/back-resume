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
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { DEFAULT_LANGUAGE } from '../../common/constants';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Blog } from './entities/blog.entity';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ایجاد بلاگ جدید (فقط ادمین)' })
  @ApiCreatedResponse({ description: 'بلاگ با موفقیت ایجاد شد', type: Blog })
  @ApiUnauthorizedResponse({ description: 'وارد نشده‌اید یا توکن نامعتبر است' })
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'به‌روزرسانی بلاگ (فقط ادمین)' })
  @ApiOkResponse({ description: 'بلاگ به‌روز شد', type: Blog })
  @ApiParam({ name: 'id', type: String, description: 'شناسه UUID بلاگ' })
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'حذف بلاگ (فقط ادمین)' })
  @ApiOkResponse({ description: 'بلاگ حذف شد' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  // عمومی (فقط منتشر شده)
  @Get()
  @ApiOperation({ summary: 'دریافت لیست بلاگ‌های منتشر شده (عمومی)' })
  @ApiQuery({
    name: 'lang',
    required: false,
    example: 'fa',
    description: 'کد زبان (fa, en, ...)',
  })
  @ApiOkResponse({ type: [Blog], description: 'آرایه‌ای از بلاگ‌ها' })
  async findAll(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const language = lang || acceptLanguage?.split(',')[0] || DEFAULT_LANGUAGE;
    return this.blogService.findAll(language, false);
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت جزئیات یک بلاگ (عمومی - فقط منتشر شده)' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'lang', required: false, example: 'fa' })
  @ApiOkResponse({ type: Blog })
  async findOne(
    @Param('id') id: string,
    @Query('lang') lang?: string,
    @Req() req?: Request,
  ) {
    const acceptLanguage = req?.headers['accept-language'];
    const language = lang || acceptLanguage?.split(',')[0] || DEFAULT_LANGUAGE;
    return this.blogService.findOne(id, language, false);
  }

  // ادمین (همه وضعیت‌ها)
  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'دریافت همه بلاگ‌ها (ادمین) - شامل پیش‌نویس و بایگانی',
  })
  @ApiOkResponse({ type: [Blog] })
  async findAllAdmin(@Query('lang') lang?: string) {
    return this.blogService.findAll(lang || DEFAULT_LANGUAGE, true);
  }

  @Get('admin/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'دریافت جزئیات بلاگ (ادمین) - حتی اگر پیش‌نویس باشد',
  })
  @ApiParam({ name: 'id', type: String })
  async findOneAdmin(@Param('id') id: string, @Query('lang') lang?: string) {
    return this.blogService.findOne(id, lang || DEFAULT_LANGUAGE, true);
  }
}
