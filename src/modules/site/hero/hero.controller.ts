import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { HeroService } from './hero.service';
import { UpdateHeroDto } from './dto/upsert-hero.dto';
import { DEFAULT_LANGUAGE } from '../../../common/constants';
import {
  HeroResponseDto,
  HeroFullResponseDto,
  HeroTranslationResponseDto,
} from './dto/hero-response.dto';

@ApiTags('site-hero')
@ApiExtraModels(
  HeroResponseDto,
  HeroFullResponseDto,
  HeroTranslationResponseDto,
)
@Controller('site/hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  // ─────────────────────────────────────────────
  // GET /site/hero?lang=fa  → عمومی
  // ─────────────────────────────────────────────
  @Get()
  @ApiOperation({
    summary: 'دریافت Hero به زبان مشخص (عمومی)',
    description: `
دریافت اطلاعات Hero (صفحه اصلی) به زبان درخواستی.  
**Fallback:** درخواستی → \`en\` → \`fa\` → اولین.
    `,
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    example: 'fa',
    enum: ['fa', 'en', 'fr', 'de', 'es', 'ar'],
    description: 'کد زبان',
  })
  @ApiOkResponse({
    description: 'اطلاعات Hero',
    type: HeroResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Hero یافت نشد',
    schema: {
      example: {
        message: 'Hero not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async get(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const finalLang =
      lang || acceptLanguage?.split(',')[0]?.trim() || DEFAULT_LANGUAGE;

    return this.heroService.getByLanguage(finalLang);
  }

  // ─────────────────────────────────────────────
  // GET /site/hero/admin  → ادمین
  // ─────────────────────────────────────────────
  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'دریافت Hero با همه ترجمه‌ها (ادمین)',
    description: 'برای ویرایش در پنل ادمین.',
  })
  @ApiOkResponse({
    description: 'Hero با آرایه کامل ترجمه‌ها',
    type: HeroFullResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'Hero یافت نشد' })
  getAll() {
    return this.heroService.getAll();
  }

  // ─────────────────────────────────────────────
  // PATCH /site/hero  → ادمین
  // ─────────────────────────────────────────────
  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'به‌روزرسانی Hero (ادمین)',
    description: `
**Replace کامل:** اگه \`translations\` بفرستی، کل ترجمه‌ها جایگزین می‌شن.  
اگه نفرستی، هیچی تغییر نمی‌کنه.
    `,
  })
  @ApiBody({
    type: UpdateHeroDto,
    examples: {
      'full-payload': {
        summary: 'پیلود کامل (en + fa)',
        value: {
          translations: [
            {
              language: 'en',
              title: 'Building reliable software.',
              subtitle: 'Thinking like an attacker.',
              description:
                'I design and build modern web applications while exploring cybersecurity.',
              cta1: 'View my work',
              cta2: 'Explore skills',
              status: 'Available for new opportunities',
              role: 'Software Engineer · Security',
            },
            {
              language: 'fa',
              title: 'ساخت نرم‌افزارهای قابل اعتماد.',
              subtitle: 'تفکر مانند یک مهاجم.',
              description:
                'من برنامه‌های وب مدرن طراحی و می‌سازم و همزمان در حوزه امنیت سایبری فعالیت می‌کنم.',
              cta1: 'مشاهده کارهای من',
              cta2: 'مهارت‌ها را ببینید',
              status: 'آماده همکاری برای پروژه‌های جدید',
              role: 'مهندس نرم‌افزار · امنیت',
            },
          ],
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Hero با موفقیت به‌روزرسانی شد',
    type: HeroFullResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  update(@Body() dto: UpdateHeroDto) {
    return this.heroService.patch(dto);
  }

  // ─────────────────────────────────────────────
  // DELETE /site/hero  → ادمین
  // ─────────────────────────────────────────────
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'حذف کامل Hero (ادمین)',
    description: 'همه ترجمه‌ها با CASCADE حذف می‌شن.',
  })
  @ApiOkResponse({
    description: 'Hero حذف شد',
    schema: {
      example: { message: 'Hero deleted successfully' },
    },
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'Hero یافت نشد' })
  remove() {
    return this.heroService.remove();
  }
}
