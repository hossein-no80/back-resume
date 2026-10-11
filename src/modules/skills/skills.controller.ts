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
import { SkillsService } from './skills.service';
import { UpdateSkillsDto } from './dto/upsert-skills.dto';
import { DEFAULT_LANGUAGE } from '../../common/constants';
import {
  SkillCategoryResponseDto,
  SkillItemResponseDto,
  SkillsAdminResponseDto,
  SkillsResponseDto,
  SkillsStatsResponseDto,
  SkillCategoryAdminResponseDto,
  SkillItemAdminResponseDto,
  SkillCategoryTranslationResponseDto,
  SkillItemTranslationResponseDto,
} from './dto/skills-response.dto';

@ApiTags('skills')
@ApiExtraModels(
  SkillsResponseDto,
  SkillsAdminResponseDto,
  SkillsStatsResponseDto,
  SkillCategoryResponseDto,
  SkillItemResponseDto,
  SkillCategoryAdminResponseDto,
  SkillItemAdminResponseDto,
  SkillCategoryTranslationResponseDto,
  SkillItemTranslationResponseDto,
)
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  // ─────────────────────────────────────────────
  // GET /skills?lang=fa  → عمومی
  // ─────────────────────────────────────────────
  @Get()
  @ApiOperation({
    summary: 'دریافت Skills به زبان مشخص (عمومی)',
    description: `
دریافت همه دسته‌بندی‌ها و مهارت‌ها به زبان درخواستی.  
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
    description: 'لیست دسته‌بندی‌ها و مهارت‌ها',
    type: SkillsResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Skills یافت نشد',
    schema: {
      example: {
        message: 'Skills not found. Please create them via PATCH /skills',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async get(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const finalLang =
      lang || acceptLanguage?.split(',')[0]?.trim() || DEFAULT_LANGUAGE;

    return this.skillsService.getByLanguage(finalLang);
  }

  // ─────────────────────────────────────────────
  // GET /skills/admin  → ادمین (همه ترجمه‌ها)
  // ─────────────────────────────────────────────
  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'دریافت Skills با همه ترجمه‌ها (ادمین)',
    description:
      'همه ترجمه‌های همه زبان‌ها برمی‌گرده. برای ویرایش در پنل ادمین.',
  })
  @ApiOkResponse({
    description: 'Skills با آرایه کامل ترجمه‌ها',
    type: SkillsAdminResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'Skills یافت نشد' })
  getAll() {
    return this.skillsService.getAll();
  }

  // ─────────────────────────────────────────────
  // PATCH /skills  → ادمین (replace کامل)
  // ─────────────────────────────────────────────
  @Patch()
  // @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'به‌روزرسانی Skills (ادمین)',
    description: `
**Replace کامل:** کل ساختار قبلی (دسته‌بندی + ترجمه‌ها + مهارت‌ها) پاک می‌شه و با ساختار جدید جایگزین می‌شه.

**نکات:**
- اگه \`categories\` نفرستی → هیچی تغییر نمی‌کنه (همون داده قبلی برمی‌گرده).
- \`key\` هر دسته باید یکتا باشه.
- هر دسته باید حداقل یک ترجمه داشته باشه.
- زبان ترجمه‌ها باید پشتیبانی بشه (\`fa, en, fr, de, es, ar\`).
- \`level\` بین ۱ تا ۵.
    `,
  })
  @ApiBody({
    type: UpdateSkillsDto,
    examples: {
      'single-category': {
        summary: 'فقط یه دسته (minimal)',
        value: {
          categories: [
            {
              key: 'engineering',
              icon: 'Code2',
              order: 0,
              translations: [
                {
                  language: 'en',
                  title: 'Engineering',
                  description: 'Core software engineering skills',
                },
                {
                  language: 'fa',
                  title: 'مهندسی',
                  description: 'مهارت‌های اصلی مهندسی نرم‌افزار',
                },
              ],
              skills: [
                {
                  level: 5,
                  years: 5,
                  order: 0,
                  translations: [
                    {
                      language: 'en',
                      name: 'TypeScript / JavaScript',
                      description: 'Expert in modern JS/TS development',
                    },
                    {
                      language: 'fa',
                      name: 'TypeScript / JavaScript',
                      description: 'متخصص در توسعه مدرن JS/TS',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      'full-payload': {
        summary: 'پیلود کامل (4 دسته)',
        value: {
          categories: [
            {
              key: 'engineering',
              icon: 'Code2',
              order: 0,
              translations: [
                {
                  language: 'en',
                  title: 'Engineering',
                  description: 'Core software engineering skills',
                },
                {
                  language: 'fa',
                  title: 'مهندسی',
                  description: 'مهارت‌های اصلی مهندسی نرم‌افزار',
                },
              ],
              skills: [
                {
                  level: 5,
                  years: 5,
                  order: 0,
                  translations: [
                    {
                      language: 'en',
                      name: 'TypeScript / JavaScript',
                      description: 'Expert in modern JS/TS',
                    },
                    {
                      language: 'fa',
                      name: 'TypeScript / JavaScript',
                      description: 'متخصص در JS/TS مدرن',
                    },
                  ],
                },
                {
                  level: 5,
                  years: 4,
                  order: 1,
                  translations: [
                    {
                      language: 'en',
                      name: 'React & Next.js',
                      description: 'Production-grade apps',
                    },
                    {
                      language: 'fa',
                      name: 'React & Next.js',
                      description: 'اپلیکیشن‌های Production',
                    },
                  ],
                },
              ],
            },
            {
              key: 'security',
              icon: 'Shield',
              order: 1,
              translations: [
                {
                  language: 'en',
                  title: 'Security',
                  description: 'Web & application security',
                },
                {
                  language: 'fa',
                  title: 'امنیت',
                  description: 'امنیت وب و برنامه',
                },
              ],
              skills: [
                {
                  level: 4,
                  years: 3,
                  order: 0,
                  translations: [
                    {
                      language: 'en',
                      name: 'Web Security',
                      description: 'OWASP Top 10',
                    },
                    {
                      language: 'fa',
                      name: 'Web Security',
                      description: 'OWASP Top 10',
                    },
                  ],
                },
              ],
            },
            {
              key: 'fullstack',
              icon: 'Server',
              order: 2,
              translations: [
                {
                  language: 'en',
                  title: 'Full Stack',
                  description: 'End-to-end development',
                },
                {
                  language: 'fa',
                  title: 'فول‌استک',
                  description: 'توسعه از ابتدا تا انتها',
                },
              ],
              skills: [
                {
                  level: 4,
                  years: 4,
                  order: 0,
                  translations: [
                    {
                      language: 'en',
                      name: 'Backend Development',
                      description: 'REST APIs, microservices',
                    },
                    {
                      language: 'fa',
                      name: 'Backend Development',
                      description: 'REST API و میکروسرویس',
                    },
                  ],
                },
              ],
            },
            {
              key: 'tools',
              icon: 'GitBranch',
              order: 3,
              translations: [
                {
                  language: 'en',
                  title: 'Tools & Practices',
                  description: 'Development tools & workflows',
                },
                {
                  language: 'fa',
                  title: 'ابزارها و روش‌ها',
                  description: 'ابزارهای توسعه و گردش کار',
                },
              ],
              skills: [
                {
                  level: 5,
                  years: 5,
                  order: 0,
                  translations: [
                    {
                      language: 'en',
                      name: 'Git & GitHub',
                      description: 'Version control',
                    },
                    {
                      language: 'fa',
                      name: 'Git & GitHub',
                      description: 'کنترل نسخه',
                    },
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
    description: 'Skills با موفقیت به‌روزرسانی شد',
    type: SkillsAdminResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  update(@Body() dto: UpdateSkillsDto) {
    return this.skillsService.patch(dto);
  }

  // ─────────────────────────────────────────────
  // DELETE /skills  → ادمین
  // ─────────────────────────────────────────────
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'حذف کامل Skills (ادمین)',
    description: 'همه دسته‌بندی‌ها، ترجمه‌ها و مهارت‌ها با CASCADE حذف می‌شن.',
  })
  @ApiOkResponse({
    description: 'Skills حذف شد',
    schema: {
      example: { message: 'Skills deleted successfully' },
    },
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'Skills یافت نشد' })
  remove() {
    return this.skillsService.remove();
  }
}
