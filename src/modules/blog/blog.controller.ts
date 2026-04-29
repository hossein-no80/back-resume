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

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  // عمومی (فقط منتشر شده)
  @Get()
  async findAll(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const language = lang || acceptLanguage?.split(',')[0] || DEFAULT_LANGUAGE;
    return this.blogService.findAll(language, false);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const language = lang || acceptLanguage?.split(',')[0] || DEFAULT_LANGUAGE;
    return this.blogService.findOne(id, language, false);
  }

  // ادمین (همه وضعیت‌ها)
  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'))
  async findAllAdmin(@Query('lang') lang?: string) {
    return this.blogService.findAll(lang || DEFAULT_LANGUAGE, true);
  }

  @Get('admin/:id')
  @UseGuards(AuthGuard('jwt'))
  async findOneAdmin(@Param('id') id: string, @Query('lang') lang?: string) {
    return this.blogService.findOne(id, lang || DEFAULT_LANGUAGE, true);
  }
}