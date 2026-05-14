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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AboutService } from './about.service';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { About } from './entities/about.entity';
import type { Request } from 'express';

@ApiTags('about')
@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ایجاد یا بازنویسی کامل اطلاعات about (ادمین)' })
  @ApiBody({ type: CreateAboutDto })
  @ApiCreatedResponse({ type: About, description: 'اطلاعات about ذخیره شد' })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  createOrUpdate(@Body() createAboutDto: CreateAboutDto) {
    return this.aboutService.createOrUpdate(createAboutDto);
  }

  @Get()
  @ApiOperation({
    summary: 'دریافت اطلاعات about (عمومی - با پشتیبانی از زبان)',
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    example: 'fa',
    description: 'کد زبان',
  })
  @ApiOkResponse({ type: About })
  async findOne(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const language = lang || acceptLanguage?.split(',')[0] || 'fa';
    return this.aboutService.getAbout(language);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'به‌روزرسانی جزئی اطلاعات about (ادمین)' })
  @ApiBody({ type: UpdateAboutDto })
  @ApiOkResponse({ type: About })
  update(@Body() updateAboutDto: UpdateAboutDto) {
    return this.aboutService.update(updateAboutDto);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'حذف کامل اطلاعات about (ادمین)' })
  @ApiOkResponse({ description: 'اطلاعات about حذف شد' })
  remove() {
    return this.aboutService.remove();
  }
}
