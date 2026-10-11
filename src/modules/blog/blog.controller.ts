import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { BlogService } from './blog.service';
import { UpdateBlogDto } from './dto/upsert-blog.dto';
import { DEFAULT_LANGUAGE } from '../../common/constants';
import {
  BlogResponseDto,
  BlogAdminListResponseDto,
  BlogPostItemResponseDto,
  BlogPostAdminResponseDto,
  BlogTranslationResponseDto,
  BlogStatsResponseDto,
  BlogSectionResponseDto,
} from './dto/blog-response.dto';

@ApiTags('blog')
@ApiExtraModels(
  BlogResponseDto,
  BlogAdminListResponseDto,
  BlogPostItemResponseDto,
  BlogPostAdminResponseDto,
  BlogTranslationResponseDto,
  BlogStatsResponseDto,
  BlogSectionResponseDto,
)
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // ─────────────────────────────────────────────
  // GET /blog?lang=fa  → عمومی (فقط published)
  // ─────────────────────────────────────────────
  @Get()
  @ApiOperation({
    summary: 'دریافت لیست پست‌های منتشرشده (عمومی)',
    description: `
لیست همه پست‌های **published** به زبان درخواستی.  
**Fallback زبان:** درخواستی → \`en\` → \`fa\` → اولین.
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
    description: 'لیست پست‌ها با آمار',
    type: BlogResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'پستی یافت نشد',
    schema: {
      example: {
        message: 'Blog posts not found. Please create them via PATCH /blog',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async get(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const finalLang =
      lang || acceptLanguage?.split(',')[0]?.trim() || DEFAULT_LANGUAGE;

    return this.blogService.getByLanguage(finalLang);
  }

  // ─────────────────────────────────────────────
  // GET /blog/admin  → ادمین (همه پست‌ها)
  // ⚠️ قبل از :slug ثبت می‌شه چون route order مهمه
  // ─────────────────────────────────────────────
  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'دریافت همه پست‌ها (ادمین)',
    description: 'شامل draft + published + همه ترجمه‌ها.',
  })
  @ApiOkResponse({
    description: 'لیست پست‌ها با تمام ترجمه‌ها',
    type: BlogAdminListResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'پستی یافت نشد' })
  getAll() {
    return this.blogService.getAll();
  }

  // ─────────────────────────────────────────────
  // PATCH /blog  → ادمین (replace-all)
  // ─────────────────────────────────────────────
  @Patch()
  // @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'به‌روزرسانی پست‌ها (ادمین)',
    description: `
**Replace کامل:** همه پست‌های قبلی پاک و با ساختار جدید جایگزین می‌شن.

**نکات:**
- اگه \`posts\` نفرستی → هیچی تغییر نمی‌کنه.
- \`slug\` هر پست باید یکتا باشه.
- \`category\` باید یکی از این‌ها باشه: \`security\`, \`development\`, \`devops\`, \`career\`, \`opensource\`.
- هر پست باید حداقل یه ترجمه داشته باشه.
- \`sections\` آرایه‌ای از \`{title, content}\`.
    `,
  })
  @ApiBody({
    type: UpdateBlogDto,
    examples: {
      'single-post': {
        summary: 'یه پست کامل',
        value: {
          posts: [
            {
              slug: 'securing-nextjs-application-guide',
              category: 'security',
              authorName: 'John Doe',
              authorAvatar: '',
              date: '2025-03-15',
              readTime: 12,
              coverImage: '/blog/security-nextjs.jpg',
              statsViews: 2847,
              statsLikes: 342,
              statsComments: 28,
              featured: true,
              published: true,
              order: 0,
              translations: [
                {
                  language: 'en',
                  title:
                    'Securing Your Next.js Application: A Comprehensive Guide',
                  excerpt:
                    'Learn essential security practices for Next.js applications.',
                  intro:
                    'Modern software development is not only about making a feature work.',
                  authorRole: 'Senior Security Engineer',
                  tags: ['Next.js', 'Security', 'OWASP'],
                  sections: [
                    {
                      title: 'Introduction',
                      content:
                        'Modern software development is not only about making a feature work.',
                    },
                    {
                      title: 'Key Concepts',
                      content:
                        'Before implementation, identify the main requirements and risks.',
                    },
                  ],
                },
                {
                  language: 'fa',
                  title: 'راهنمای جامع امن‌سازی اپلیکیشن Next.js',
                  excerpt: 'یادگیری روش‌های امنیتی ضروری برای Next.js.',
                  intro:
                    'در توسعه مدرن نرم‌افزار، فقط ساختن یک قابلیت کافی نیست.',
                  authorRole: 'مهندس امنیت ارشد',
                  tags: ['Next.js', 'امنیت', 'OWASP'],
                  sections: [
                    {
                      title: 'مقدمه',
                      content:
                        'در توسعه مدرن نرم‌افزار، فقط ساختن یک قابلیت کافی نیست.',
                    },
                    {
                      title: 'نکات مهم',
                      content:
                        'قبل از پیاده‌سازی، نیازمندی‌ها و ریسک‌های اصلی مشخص شوند.',
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
    description: 'Blog با موفقیت به‌روزرسانی شد',
    type: BlogAdminListResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  update(@Body() dto: UpdateBlogDto) {
    return this.blogService.patch(dto);
  }

  // ─────────────────────────────────────────────
  // GET /blog/:slug?lang=fa  → عمومی (جزئیات)
  // ⚠️ آخر ثبت می‌شه چون یه parameter عمومی داره
  // ─────────────────────────────────────────────
  @Get(':slug')
  @ApiOperation({
    summary: 'دریافت جزئیات یه پست با slug (عمومی)',
    description:
      'فقط پست‌های **published** قابل دسترس هستن. برای draft از ادمین استفاده کن.',
  })
  @ApiParam({
    name: 'slug',
    example: 'securing-nextjs-application-guide',
    description: 'slug پست',
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    example: 'fa',
    enum: ['fa', 'en', 'fr', 'de', 'es', 'ar'],
  })
  @ApiOkResponse({
    description: 'جزئیات پست',
    type: BlogPostItemResponseDto,
  })
  @ApiNotFoundResponse({ description: 'پست یافت نشد یا منتشر نشده' })
  async getBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang?: string,
    @Req() req?: Request,
  ) {
    const acceptLanguage = req?.headers['accept-language'];
    const finalLang =
      lang || acceptLanguage?.split(',')[0]?.trim() || DEFAULT_LANGUAGE;

    return this.blogService.getBySlug(slug, finalLang);
  }

  // ─────────────────────────────────────────────
  // POST /blog/:slug/view  → عمومی (افزایش بازدید)
  // ─────────────────────────────────────────────
  @Post(':slug/view')
  @ApiOperation({
    summary: 'افزایش شمارنده بازدید (عمومی)',
    description:
      'با هر فراخوانی، `statsViews` رو یک واحد افزایش می‌ده. روی فرانت تو صفحه جزئیات استفاده کن.',
  })
  @ApiParam({
    name: 'slug',
    example: 'securing-nextjs-application-guide',
  })
  @ApiOkResponse({
    description: 'شمارنده بازدید جدید',
    schema: {
      example: { views: 2848 },
    },
  })
  @ApiNotFoundResponse({ description: 'پست یافت نشد' })
  incrementViews(@Param('slug') slug: string) {
    return this.blogService.incrementViews(slug);
  }

  // ─────────────────────────────────────────────
  // DELETE /blog  → ادمین
  // ─────────────────────────────────────────────
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'حذف کامل Blog (ادمین)',
    description: 'همه پست‌ها و ترجمه‌هاشون با CASCADE حذف می‌شن.',
  })
  @ApiOkResponse({
    description: 'Blog حذف شد',
    schema: {
      example: { message: 'Blog deleted successfully' },
    },
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'پستی یافت نشد' })
  remove() {
    return this.blogService.remove();
  }
}
