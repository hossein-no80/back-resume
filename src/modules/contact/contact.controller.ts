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
  Query,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import type { Request } from 'express';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // ---- اطلاعات تماس (عمومی) ----
  @Get()
  getContactInfo() {
    return this.contactService.getContactInfo();
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  updateContactInfo(@Body() updateContactDto: UpdateContactDto) {
    return this.contactService.updateContactInfo(updateContactDto);
  }

  // ---- ارسال پیام جدید (عمومی) ----
  @Post('message')
  async sendMessage(
    @Body() dto: CreateMessageDto,
    @Req() req: Request,
  ) {
    // تشخیص زبان از هدر Accept-Language
    const acceptLanguage = req.headers['accept-language'];
    const lang = acceptLanguage?.split(',')[0] || 'en';
    return this.contactService.submitMessage(dto, lang);
  }

  // ---- مدیریت پیام‌ها (ادمین) ----
  @Get('admin/messages')
  @UseGuards(AuthGuard('jwt'))
  getAllMessages() {
    return this.contactService.findAllMessages();
  }

  @Get('admin/messages/:id')
  @UseGuards(AuthGuard('jwt'))
  getMessage(@Param('id') id: string) {
    return this.contactService.findOneMessage(id);
  }

  @Delete('admin/messages/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteMessage(@Param('id') id: string) {
    return this.contactService.removeMessage(id);
  }
}