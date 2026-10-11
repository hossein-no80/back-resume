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
import { ExperienceService } from './experience.service';
import { UpdateExperienceDto } from './dto/upsert-experience.dto';
import { DEFAULT_LANGUAGE } from '../../common/constants';
import {
  ExperienceResponseDto,
  ExperienceAdminListResponseDto,
  ExperienceItemResponseDto,
  ExperienceAdminResponseDto,
  ExperienceTranslationResponseDto,
  ExperienceStatsResponseDto,
} from './dto/experience-response.dto';

@ApiTags('experience')
@ApiExtraModels(
  ExperienceResponseDto,
  ExperienceAdminListResponseDto,
  ExperienceItemResponseDto,
  ExperienceAdminResponseDto,
  ExperienceTranslationResponseDto,
  ExperienceStatsResponseDto,
)
@Controller('experiences')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  // ─────────────────────────────────────────────
  // GET /experiences?lang=fa  → عمومی
  // ─────────────────────────────────────────────
  @Get()
  @ApiOperation({
    summary: 'دریافت تجربه‌ها به زبان مشخص (عمومی)',
    description: `
دریافت همه تجربه‌های شغلی به زبان درخواستی.  
**Fallback:** اگه زبان موجود نبود → \`en\` → \`fa\` → اولین ترجمه.
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
    description: 'لیست تجربه‌ها با آمار',
    type: ExperienceResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Experience یافت نشد',
    schema: {
      example: {
        message:
          'Experience not found. Please create it via PATCH /experiences',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async get(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const finalLang =
      lang || acceptLanguage?.split(',')[0]?.trim() || DEFAULT_LANGUAGE;

    return this.experienceService.getByLanguage(finalLang);
  }

  // ─────────────────────────────────────────────
  // GET /experiences/admin  → ادمین
  // ─────────────────────────────────────────────
  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'دریافت Experience با همه ترجمه‌ها (ادمین)',
    description:
      'همه ترجمه‌های همه زبان‌ها برمی‌گرده. برای ویرایش در پنل ادمین.',
  })
  @ApiOkResponse({
    description: 'Experience با آرایه کامل ترجمه‌ها',
    type: ExperienceAdminListResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'Experience یافت نشد' })
  getAll() {
    return this.experienceService.getAll();
  }

  // ─────────────────────────────────────────────
  // PATCH /experiences  → ادمین
  // ─────────────────────────────────────────────
  @Patch()
  // @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'به‌روزرسانی Experience (ادمین)',
    description: `
**Replace کامل:** کل ساختار قبلی پاک می‌شه و با ساختار جدید جایگزین می‌شه.

**نکات:**
- اگه \`experiences\` نفرستی → هیچی تغییر نمی‌کنه.
- \`endDate\` رو نفرست یا \`null\` بده → یعنی «تا کنون» (Present).
- \`type\` باید یکی از این‌ها باشه: \`full-time\`, \`part-time\`, \`freelance\`, \`internship\`.
- هر تجربه باید حداقل یک ترجمه داشته باشه.
    `,
  })
  @ApiBody({
    type: UpdateExperienceDto,
    examples: {
      'single-experience': {
        summary: 'یه تجربه کامل',
        value: {
          experiences: [
            {
              company: 'TechCorp Inc.',
              companyLogo: '',
              startDate: 'Jan 2024',
              endDate: '',
              type: 'full-time',
              website: 'https://techcorp.com',
              featured: true,
              order: 0,
              technologies: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
              translations: [
                {
                  language: 'en',
                  position: 'Senior Full Stack Developer',
                  location: 'San Francisco, CA (Remote)',
                  industry: 'FinTech',
                  description: [
                    'Leading the development of a next-gen financial trading platform serving 50,000+ active users.',
                    'Architecting microservices infrastructure using Node.js, TypeScript, and Docker.',
                  ],
                  achievements: [
                    'Reduced API response time by 45% through query optimization.',
                    'Led migration from monolith to microservices with zero downtime.',
                  ],
                },
                {
                  language: 'fa',
                  position: 'توسعه‌دهنده ارشد فول‌استک',
                  location: 'سان‌فرانسیسکو (دورکاری)',
                  industry: 'فین‌تک',
                  description: [
                    'رهبری توسعه پلتفرم معاملاتی نسل جدید با ۵۰,۰۰۰ کاربر فعال.',
                    'طراحی معماری میکروسرویس با Node.js، TypeScript و Docker.',
                  ],
                  achievements: [
                    'کاهش ۴۵٪ زمان پاسخ API با بهینه‌سازی query.',
                    'مهاجرت از monolith به microservice با صفر downtime.',
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Experience با موفقیت به‌روزرسانی شد',
    type: ExperienceAdminListResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  update(@Body() dto: UpdateExperienceDto) {
    return this.experienceService.patch(dto);
  }

  // ─────────────────────────────────────────────
  // DELETE /experiences  → ادمین
  // ─────────────────────────────────────────────
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'حذف کامل Experience (ادمین)',
    description: 'همه تجربه‌ها و ترجمه‌هاشون با CASCADE حذف می‌شن.',
  })
  @ApiOkResponse({
    description: 'Experience حذف شد',
    schema: {
      example: { message: 'Experience deleted successfully' },
    },
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'Experience یافت نشد' })
  remove() {
    return this.experienceService.remove();
  }
}
