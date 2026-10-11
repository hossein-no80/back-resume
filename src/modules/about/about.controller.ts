import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
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
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/upsert-about.dto';
import { DEFAULT_LANGUAGE } from '../../common/constants';
import {
  AboutFullResponseDto,
  AboutSingleResponseDto,
  AboutTranslationResponseDto,
  SocialLinksResponseDto,
} from './dto/about-response.dto';
import {
  AboutSectionDataDto,
  AboutExpertiseDataDto,
} from './dto/about-translation.dto';

@ApiTags('about')
@ApiExtraModels(
  AboutSingleResponseDto,
  AboutFullResponseDto,
  AboutTranslationResponseDto,
  SocialLinksResponseDto,
  AboutSectionDataDto,
  AboutExpertiseDataDto,
)
@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  // ─────────────────────────────────────────────
  // GET /about?lang=fa  → عمومی
  // ─────────────────────────────────────────────
  @Get()
  @ApiOperation({
    summary: 'دریافت About به زبان مشخص (عمومی)',
    description: `
دریافت اطلاعات About به زبان مشخص.  
**منطق fallback:** اگه زبان درخواستی موجود نبود، به‌ترتیب \`en\` → \`fa\` → اولین ترجمه برمی‌گرده.
    `,
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    example: 'fa',
    description: 'کد زبان (fa, en, fr, de, es, ar)',
    enum: ['fa', 'en', 'fr', 'de', 'es', 'ar'],
  })
  @ApiOkResponse({
    description: 'اطلاعات About به زبان درخواستی',
    type: AboutSingleResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'رکورد About یافت نشد یا ترجمه‌ای موجود نیست',
    schema: {
      example: {
        message: 'About record not found. Please create it via PATCH /about',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  getByLanguage(@Query('lang') lang?: string) {
    return this.aboutService.getByLanguage(lang || DEFAULT_LANGUAGE);
  }

  // ─────────────────────────────────────────────
  // GET /about/admin  → ادمین (همه ترجمه‌ها)
  // ─────────────────────────────────────────────
  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'دریافت About با همه ترجمه‌ها (ادمین)',
    description:
      'همه ترجمه‌ها رو برمی‌گردونه. برای ویرایش در پنل ادمین استفاده می‌شه.',
  })
  @ApiOkResponse({
    description: 'About با آرایه کامل ترجمه‌ها',
    type: AboutFullResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'توکن JWT نامعتبر یا وارد نشده',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'رکورد About یافت نشد',
  })
  getAll() {
    return this.aboutService.getAll();
  }

  // ─────────────────────────────────────────────
  // PATCH /about  → ادمین (partial update)
  // ─────────────────────────────────────────────
  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'به‌روزرسانی About (ادمین)',
    description: `
**Partial Update:** فقط فیلدهای ارسالی آپدیت می‌شن، بقیه دست‌نخورده می‌مونن.

**نکات مهم:**
- برای ساخت اولیه، فیلد \`email\` الزامی‌ست.
- اگه \`translations\` بفرستی، **کل ترجمه‌های قبلی حذف و با جدید جایگزین می‌شن**.
- اگه \`translations\` نفرستی، ترجمه‌های موجود دست‌نخورده می‌مونن.
- فیلدهای خالی (\`""\`) در \`socialLinks\` به‌عنوان \`""\` ذخیره می‌شن.
    `,
  })
  @ApiBody({
    type: UpdateAboutDto,
    examples: {
      'only-phone': {
        summary: 'فقط تغییر شماره تلفن',
        value: {
          phone: '+98 912 000 0000',
        },
      },
      'only-translations': {
        summary: 'فقط تغییر ترجمه‌ها',
        value: {
          translations: [
            {
              language: 'fa',
              name: 'حسین رضایی',
              title: 'مهندس نرم‌افزار · امنیت',
              heading: 'مهندسی سیستم‌ها. درک نحوه کار آن‌ها.',
              bio: 'من یک مهندس نرم‌افزار هستم.',
              location: 'تهران، ایران',
              aboutSections: [
                {
                  id: 'sec-1',
                  icon: 'Code2',
                  order: 0,
                  title: 'پیشینه من',
                  content: 'مهندس نرم‌افزار با تمرکز بر وب.',
                },
              ],
              expertise: [
                {
                  id: 'exp-1',
                  icon: 'Code2',
                  order: 0,
                  title: 'مهندسی',
                  description: 'ساخت نرم‌افزار مدرن.',
                },
              ],
            },
          ],
        },
      },
      'full-payload': {
        summary: 'پیلود کامل (ساخت اولیه)',
        value: {
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          avatar: '/uploads/avatar.jpg',
          resumeUrl: '/uploads/resume.pdf',
          resumeFileName: 'John_Doe_Resume.pdf',
          socialLinks: {
            github: 'https://github.com/johndoe',
            linkedin: 'https://linkedin.com/in/johndoe',
            twitter: 'https://twitter.com/johndoe',
            youtube: 'https://youtube.com/@johndoe',
            website: 'https://johndoe.dev',
          },
          available: true,
          openToWork: true,
          translations: [
            {
              language: 'en',
              name: 'John Doe',
              title: 'Software Engineer · Security',
              heading: 'Engineering systems. Understanding how they work.',
              bio: "I'm a software engineer.",
              location: 'San Francisco, CA',
              aboutSections: [
                {
                  id: 'sec-1',
                  icon: 'Code2',
                  order: 0,
                  title: 'My Background',
                  content: 'Software engineer building modern web apps.',
                },
              ],
              expertise: [
                {
                  id: 'exp-1',
                  icon: 'Code2',
                  order: 0,
                  title: 'Engineering',
                  description: 'Building modern software.',
                },
              ],
            },
          ],
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'About با موفقیت به‌روزرسانی شد',
    type: AboutFullResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'رکورد About یافت نشد' })
  update(@Body() dto: UpdateAboutDto) {
    return this.aboutService.patch(dto);
  }

  // ─────────────────────────────────────────────
  // DELETE /about  → ادمین
  // ─────────────────────────────────────────────
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'حذف کامل About (ادمین)',
    description: 'رکورد About و همه ترجمه‌هاش (با CASCADE) حذف می‌شن.',
  })
  @ApiOkResponse({
    description: 'About حذف شد',
    schema: {
      example: { message: 'About deleted successfully' },
    },
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'رکورد About یافت نشد' })
  remove() {
    return this.aboutService.remove();
  }
}
