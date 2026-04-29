// src/modules/contact/contact.service.ts
import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { EmailMessage } from './entities/email-message.entity';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,
    @InjectRepository(EmailMessage)
    private messageRepo: Repository<EmailMessage>,
    private mailerService: MailerService,
    private i18n: I18nService,
  ) {}

  // ---- اطلاعات تماس (فقط یک رکورد با id ثابت) ----
  private async getContactEntity(): Promise<Contact> {
    const FIXED_ID = '1'; // چون فیلد id از نوع uuid است، مقدار ثابت '1'
    let contact = await this.contactRepo.findOne({ where: { id: FIXED_ID } });
    if (!contact) {
      // ایجاد رکورد پیش‌فرض
      contact = this.contactRepo.create({
        id: FIXED_ID,
        email: 'admin@example.com',
      });
      await this.contactRepo.save(contact);
      this.logger.log('Default contact record created with id=1');
    }
    return contact;
  }

  async getContactInfo(): Promise<Contact> {
    return this.getContactEntity();
  }

  async updateContactInfo(updateDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.getContactEntity();
    Object.assign(contact, updateDto);
    await this.contactRepo.save(contact);
    return contact;
  }

  // ---- مدیریت پیام‌های فرم تماس ----
  async submitMessage(dto: CreateMessageDto, lang: string = 'en') {
    // 1. ذخیره در دیتابیس
    const contact = await this.getContactEntity();
    const newMessage = this.messageRepo.create({
      senderName: dto.senderName,
      senderEmail: dto.senderEmail,
      subject: dto.subject,
      body: dto.message,
      contact,
      contactId: contact.id,
    });
    await this.messageRepo.save(newMessage);

    // 2. ارسال ایمیل به ادمین (اگر تنظیمات SMTP موجود باشد)
    const adminEmail = process.env.ADMIN_EMAIL;
    // بخش ارسال ایمیل در contact.service.ts
    if (adminEmail) {
      try {
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>📬 پیام جدید از سایت</h2>
        <p><strong>نام:</strong> ${dto.senderName}</p>
        <p><strong>ایمیل:</strong> ${dto.senderEmail}</p>
        <p><strong>موضوع:</strong> ${dto.subject}</p>
        <p><strong>متن پیام:</strong></p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
          ${dto.message.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
        await this.mailerService.sendMail({
          to: adminEmail,
          subject: `📬 پیام جدید از ${dto.senderName}: ${dto.subject}`,
          html: htmlContent,
        });
        this.logger.log(`Email sent to admin for message ID ${newMessage.id}`);
      } catch (err) {
        this.logger.error(`Failed to send email: ${err.message}`, err.stack);
      }
    }

    // 3. پیام موفقیت ترجمه‌شده
    const successMessage = this.i18n.translate('contact.message_sent', { lang });
    return { message: successMessage };
  }

  // ---- مدیریت ادمین ----
  async findAllMessages(): Promise<EmailMessage[]> {
    return this.messageRepo.find({
      order: { receivedAt: 'DESC' },
    });
  }

  async findOneMessage(id: string): Promise<EmailMessage> {
    const msg = await this.messageRepo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException('Message not found');
    return msg;
  }

  async removeMessage(id: string): Promise<void> {
    const msg = await this.findOneMessage(id);
    await this.messageRepo.remove(msg);
  }
}