// src/modules/contact/contact.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Contact } from './entities/contact.entity';
import { EmailMessage } from './entities/email-message.entity';
import { MessageResponseDto } from '../../common/dto/message-response.dto';
import type { Request } from 'express';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @ApiOperation({ summary: 'دریافت اطلاعات تماس (عمومی)' })
  @ApiOkResponse({ type: Contact })
  getContactInfo() {
    return this.contactService.getContactInfo();
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'به‌روزرسانی اطلاعات تماس (ادمین)' })
  @ApiBody({ type: UpdateContactDto })
  @ApiOkResponse({ type: Contact })
  @ApiUnauthorizedResponse({ description: 'نیاز به ورود' })
  updateContactInfo(@Body() updateContactDto: UpdateContactDto) {
    return this.contactService.updateContactInfo(updateContactDto);
  }

  @Post('message')
  @ApiOperation({ summary: 'ارسال پیام جدید از فرم تماس (عمومی)' })
  @ApiBody({ type: CreateMessageDto })
  @ApiCreatedResponse({ type: MessageResponseDto })
  async sendMessage(@Body() dto: CreateMessageDto, @Req() req: Request) {
    const acceptLanguage = req.headers['accept-language'];
    const lang = acceptLanguage?.split(',')[0] || 'en';
    return this.contactService.submitMessage(dto, lang);
  }

  @Get('admin/messages')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'دریافت همه پیام‌های دریافتی (ادمین)' })
  @ApiOkResponse({ type: [EmailMessage] })
  getAllMessages() {
    return this.contactService.findAllMessages();
  }

  @Get('admin/messages/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'دریافت جزئیات یک پیام (ادمین)' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: EmailMessage })
  getMessage(@Param('id') id: string) {
    return this.contactService.findOneMessage(id);
  }

  @Delete('admin/messages/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'حذف پیام (ادمین)' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'پیام با موفقیت حذف شد' })
  deleteMessage(@Param('id') id: string) {
    return this.contactService.removeMessage(id);
  }
}
