import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Param,
  Req,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
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
import { ContactService } from './contact.service';
import { UpdateContactDto } from './dto/upsert-contact.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { DEFAULT_LANGUAGE } from '../../common/constants';
import {
  ContactResponseDto,
  ContactAdminResponseDto,
  ContactTranslationResponseDto,
  WorkingHourResponseDto,
  EmailMessageResponseDto,
} from './dto/contact-response.dto';

@ApiTags('contact')
@ApiExtraModels(
  ContactResponseDto,
  ContactAdminResponseDto,
  ContactTranslationResponseDto,
  WorkingHourResponseDto,
  EmailMessageResponseDto,
)
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // ─────────────────────────────────────────────
  // GET /contact?lang=fa  → عمومی
  // ─────────────────────────────────────────────
  @Get()
  @ApiOperation({
    summary: 'دریافت اطلاعات تماس (عمومی)',
    description: `
اطلاعات Contact به زبان درخواستی.  
**نکته مهم:** فیلدهای \`email\`, \`phone\`, \`github\`, \`linkedin\`, \`location\` تو \`About\` هستن — از \`GET /about\` بگیر.  
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
    description: 'اطلاعات Contact',
    type: ContactResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Contact یافت نشد' })
  async get(@Query('lang') lang?: string, @Req() req?: Request) {
    const acceptLanguage = req?.headers['accept-language'];
    const finalLang =
      lang || acceptLanguage?.split(',')[0]?.trim() || DEFAULT_LANGUAGE;

    return this.contactService.getByLanguage(finalLang);
  }

  // ─────────────────────────────────────────────
  // GET /contact/admin  → ادمین
  // ─────────────────────────────────────────────
  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'دریافت Contact با همه ترجمه‌ها (ادمین)',
    description: 'برای ویرایش در پنل ادمین.',
  })
  @ApiOkResponse({
    description: 'Contact با آرایه کامل ترجمه‌ها',
    type: ContactAdminResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  getAll() {
    return this.contactService.getAll();
  }

  // ─────────────────────────────────────────────
  // PATCH /contact  → ادمین (partial update)
  // ─────────────────────────────────────────────
  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'به‌روزرسانی Contact (ادمین)',
    description: `
**Partial Update:** فقط فیلدهای ارسالی آپدیت می‌شن.

**نکات:**
- اگه \`translations\` بفرستی → **کل ترجمه‌های قبلی حذف و با جدید جایگزین می‌شن**.
- اگه \`translations\` نفرستی → ترجمه‌ها دست‌نخورده می‌مونن.
    `,
  })
  @ApiBody({
    type: UpdateContactDto,
    examples: {
      'only-timezone': {
        summary: 'فقط تغییر timezone',
        value: {
          timezone: 'IRST (UTC+3:30)',
        },
      },
      'full-payload': {
        summary: 'پیلود کامل',
        value: {
          timezone: 'IRST (UTC+3:30)',
          landlinePhone: '021-12345678',
          instagramUrl: 'https://instagram.com/username',
          telegramUrl: 'https://t.me/username',
          translations: [
            {
              language: 'en',
              address: 'Tehran, Azadi St., No. 12',
              workingHours: [
                { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
                { day: 'Sunday', hours: 'Closed' },
              ],
            },
            {
              language: 'fa',
              address: 'تهران، خیابان آزادی، پلاک ۱۲',
              workingHours: [
                { day: 'دوشنبه تا جمعه', hours: '۹:۰۰ تا ۱۸:۰۰' },
                { day: 'شنبه', hours: '۱۰:۰۰ تا ۱۶:۰۰' },
                { day: 'یکشنبه', hours: 'تعطیل' },
              ],
            },
          ],
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Contact با موفقیت به‌روزرسانی شد',
    type: ContactAdminResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  update(@Body() dto: UpdateContactDto) {
    return this.contactService.patch(dto);
  }

  // ─────────────────────────────────────────────
  // POST /contact/message  → عمومی (فرم تماس)
  // ─────────────────────────────────────────────
  @Post('message')
  @ApiOperation({
    summary: 'ارسال پیام جدید از فرم تماس (عمومی)',
    description:
      'پیام رو تو دیتابیس ذخیره می‌کنه و به ایمیل ادمین می‌فرسته (اگه SMTP تنظیم شده باشه).',
  })
  @ApiBody({ type: CreateMessageDto })
  @ApiCreatedResponse({
    description: 'پیام با موفقیت ارسال شد',
    schema: {
      example: {
        message: 'پیام شما با موفقیت ارسال شد. در اسرع وقت تماس می‌گیریم.',
      },
    },
  })
  async sendMessage(
    @Body() dto: CreateMessageDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    const acceptLanguage = req.headers['accept-language'];
    const lang = acceptLanguage?.split(',')[0]?.trim() || 'en';
    return this.contactService.submitMessage(dto, lang, ip);
  }

  // ─────────────────────────────────────────────
  // GET /contact/admin/messages  → ادمین
  // ─────────────────────────────────────────────
  @Get('admin/messages')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'دریافت همه پیام‌های دریافتی (ادمین)',
    description: 'مرتب‌شده بر اساس تاریخ (جدیدترین اول).',
  })
  @ApiOkResponse({
    description: 'لیست پیام‌ها',
    type: [EmailMessageResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  getAllMessages() {
    return this.contactService.findAllMessages();
  }

  // ─────────────────────────────────────────────
  // GET /contact/admin/messages/:id  → ادمین
  // ─────────────────────────────────────────────
  @Get('admin/messages/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'دریافت جزئیات یک پیام (ادمین)' })
  @ApiParam({ name: 'id', type: String, description: 'UUID پیام' })
  @ApiOkResponse({
    description: 'جزئیات پیام',
    type: EmailMessageResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'پیام یافت نشد' })
  getMessage(@Param('id') id: string) {
    return this.contactService.findOneMessage(id);
  }

  // ─────────────────────────────────────────────
  // PATCH /contact/admin/messages/:id/read  → ادمین
  // ─────────────────────────────────────────────
  @Patch('admin/messages/:id/read')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'تغییر وضعیت خوانده‌شدن پیام (ادمین)',
    description: 'برای مارک کردن پیام به‌عنوان خونده‌شده یا نخونده.',
  })
  @ApiParam({ name: 'id', type: String, description: 'UUID پیام' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isRead: {
          type: 'boolean',
          example: true,
          description: 'true = خونده‌شده، false = نخونده',
        },
      },
      required: ['isRead'],
    },
  })
  @ApiOkResponse({
    description: 'وضعیت پیام تغییر کرد',
    type: EmailMessageResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'پیام یافت نشد' })
  markAsRead(@Param('id') id: string, @Body('isRead') isRead: boolean) {
    return this.contactService.markAsRead(id, isRead);
  }

  // ─────────────────────────────────────────────
  // DELETE /contact/admin/messages/:id  → ادمین
  // ─────────────────────────────────────────────
  @Delete('admin/messages/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'حذف پیام (ادمین)' })
  @ApiParam({ name: 'id', type: String, description: 'UUID پیام' })
  @ApiOkResponse({
    description: 'پیام حذف شد',
    schema: {
      example: { message: 'Message deleted successfully' },
    },
  })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  @ApiNotFoundResponse({ description: 'پیام یافت نشد' })
  deleteMessage(@Param('id') id: string) {
    return this.contactService.removeMessage(id);
  }
}
