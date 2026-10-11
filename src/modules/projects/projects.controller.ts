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
import { ProjectsService } from './projects.service';
import { UpdateProjectsDto } from './dto/upsert-project.dto';
import { DEFAULT_LANGUAGE } from '../../common/constants';
import {
  ProjectResponseDto,
  ProjectAdminListResponseDto,
  ProjectItemResponseDto,
  ProjectAdminResponseDto,
  ProjectTranslationResponseDto,
  ProjectStatsResponseDto,
} from './dto/project-response.dto';

@ApiTags('projects')
@ApiExtraModels(
  ProjectResponseDto,
  ProjectAdminListResponseDto,
  ProjectItemResponseDto,
  ProjectAdminResponseDto,
  ProjectTranslationResponseDto,
  ProjectStatsResponseDto,
)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ─────────────────────────────────────────────
  // GET /projects?lang=fa  → عمومی
  // ─────────────────────────────────────────────
  @Get()
  @ApiOperation({
    summary: 'دریافت پروژه‌ها به زبان مشخص (عمومی)',
    description: `
دریافت همه پروژه‌ها به زبان درخواستی.  
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
    description: 'لیست پروژه‌ها با آمار',
    type: ProjectResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Projects یافت نشد',
    schema: {
      example: {
        message: 'Projects not found. Please create them via PATCH /projects',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async get(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const finalLang =
      lang || acceptLanguage?.split(',')[0]?.trim() || DEFAULT_LANGUAGE;

    return this.projectsService.getByLanguage(finalLang);
  }

  // ─────────────────────────────────────────────
  // GET /projects/admin  → ادمین
  // ─────────────────────────────────────────────
  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'دریافت Projects با همه ترجمه‌ها (ادمین)',
    description:
      'همه ترجمه‌های همه زبان‌ها برمی‌گرده. برای ویرایش در پنل ادمین.',
  })
  @ApiOkResponse({
    description: 'Projects با آرایه کامل ترجمه‌ها',
    type: ProjectAdminListResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'Projects یافت نشد' })
  getAll() {
    return this.projectsService.getAll();
  }

  // ─────────────────────────────────────────────
  // PATCH /projects  → ادمین
  // ─────────────────────────────────────────────
  @Patch()
  // @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'به‌روزرسانی Projects (ادمین)',
    description: `
**Replace کامل:** کل ساختار قبلی پاک می‌شه و با ساختار جدید جایگزین می‌شه.

**نکات:**
- اگه \`projects\` نفرستی → هیچی تغییر نمی‌کنه.
- \`category\` باید یکی از این‌ها باشه: \`web\`, \`mobile\`, \`security\`, \`fullstack\`, \`opensource\`.
- \`status\` باید یکی از این‌ها باشه: \`active\`, \`completed\`, \`in-development\`.
- هر پروژه باید حداقل یک ترجمه داشته باشه.
- \`stats\` اختیاریه (اگه نفرستی، null ذخیره می‌شه).
    `,
  })
  @ApiBody({
    type: UpdateProjectsDto,
    examples: {
      'single-project': {
        summary: 'یه پروژه کامل',
        value: {
          projects: [
            {
              category: 'security',
              image: '',
              githubUrl: 'https://github.com/yourusername/secureauth-pro',
              liveUrl: 'https://secureauth-pro.com',
              techStack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
              date: '2025',
              status: 'active',
              featured: true,
              order: 0,
              statsStars: 128,
              statsForks: 34,
              statsViews: 4200,
              translations: [
                {
                  language: 'en',
                  title: 'SecureAuth Pro',
                  description:
                    'Enterprise authentication system with advanced security features',
                  longDescription:
                    'A comprehensive authentication and authorization system designed for enterprise applications. Implements OAuth 2.0, JWT, multi-factor authentication, and role-based access control.',
                  tags: ['Authentication', 'Security', 'Enterprise'],
                  features: [
                    'Multi-factor authentication (MFA)',
                    'OAuth 2.0 integration',
                    'Role-based access control (RBAC)',
                  ],
                },
                {
                  language: 'fa',
                  title: 'سیستم احراز هویت امن',
                  description:
                    'سیستم احراز هویت سازمانی با ویژگی‌های امنیتی پیشرفته',
                  longDescription:
                    'یک سیستم جامع احراز هویت و مجوزدهی برای اپلیکیشن‌های سازمانی. پیاده‌سازی OAuth 2.0، JWT، احراز هویت چندعاملی و کنترل دسترسی بر اساس نقش.',
                  tags: ['احراز هویت', 'امنیت', 'سازمانی'],
                  features: [
                    'احراز هویت چندعاملی (MFA)',
                    'ادغام OAuth 2.0',
                    'کنترل دسترسی بر اساس نقش (RBAC)',
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
    description: 'Projects با موفقیت به‌روزرسانی شد',
    type: ProjectAdminListResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  update(@Body() dto: UpdateProjectsDto) {
    return this.projectsService.patch(dto);
  }

  // ─────────────────────────────────────────────
  // DELETE /projects  → ادمین
  // ─────────────────────────────────────────────
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'حذف کامل Projects (ادمین)',
    description: 'همه پروژه‌ها و ترجمه‌هاشون با CASCADE حذف می‌شن.',
  })
  @ApiOkResponse({
    description: 'Projects حذف شد',
    schema: {
      example: { message: 'Projects deleted successfully' },
    },
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'Projects یافت نشد' })
  remove() {
    return this.projectsService.remove();
  }
}
