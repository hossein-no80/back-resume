import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { ContactTranslation } from './entities/contact-translation.entity';
import { EmailMessage } from './entities/email-message.entity';
import { UpdateContactDto } from './dto/upsert-contact.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ContactTranslationDto } from './dto/contact-translation.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { I18nService } from 'nestjs-i18n';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../../common/constants';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface WorkingHour {
  day: string;
  hours: string;
}

export interface ContactResponse {
  id: string;
  timezone: string | null;
  landlinePhone: string | null;
  instagramUrl: string | null;
  telegramUrl: string | null;
  address: string | null;
  workingHours: WorkingHour[];
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactAdminResponse {
  id: string;
  timezone: string | null;
  landlinePhone: string | null;
  instagramUrl: string | null;
  telegramUrl: string | null;
  translations: {
    id: number;
    language: string;
    address: string | null;
    workingHours: WorkingHour[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  // id ثابت برای رکورد Contact (فقط یه رکورد داریم)
  private readonly FIXED_ID = '1';

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
    @InjectRepository(EmailMessage)
    private readonly messageRepo: Repository<EmailMessage>,
    private readonly mailerService: MailerService,
    private readonly i18n: I18nService,
    private readonly dataSource: DataSource,
  ) {}

  // ─────────────────────────────────────────────
  // GET /contact?lang=fa  (عمومی)
  // ─────────────────────────────────────────────
  async getByLanguage(
    lang: string = DEFAULT_LANGUAGE,
  ): Promise<ContactResponse> {
    const contact = await this.getOrCreateContact();

    const translations = contact.translations ?? [];
    const t =
      translations.find((x) => x.language === lang) ??
      translations.find((x) => x.language === 'en') ??
      translations.find((x) => x.language === 'fa') ??
      translations[0];

    if (!t) {
      throw new NotFoundException('No translation available for Contact');
    }

    return {
      id: contact.id,
      timezone: contact.timezone,
      landlinePhone: contact.landlinePhone,
      instagramUrl: contact.instagramUrl,
      telegramUrl: contact.telegramUrl,
      address: t.address,
      workingHours: t.workingHours ?? [],
      language: t.language,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }

  // ─────────────────────────────────────────────
  // GET /contact/admin  (ادمین)
  // ─────────────────────────────────────────────
  async getAll(): Promise<ContactAdminResponse> {
    const contact = await this.getOrCreateContact();

    return {
      id: contact.id,
      timezone: contact.timezone,
      landlinePhone: contact.landlinePhone,
      instagramUrl: contact.instagramUrl,
      telegramUrl: contact.telegramUrl,
      translations: (contact.translations ?? []).map((t) => ({
        id: t.id,
        language: t.language,
        address: t.address,
        workingHours: t.workingHours ?? [],
      })),
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }

  // ─────────────────────────────────────────────
  // PATCH /contact  (ادمین) — partial update
  // ─────────────────────────────────────────────
  async patch(dto: UpdateContactDto): Promise<ContactAdminResponse> {
    if (dto.translations) {
      this.validateUniqueLanguages(dto.translations);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // اطمینان از وجود رکورد
      let contact = await queryRunner.manager.findOne(Contact, {
        where: { id: this.FIXED_ID },
      });
      if (!contact) {
        contact = new Contact();
        contact.id = this.FIXED_ID;
      }

      // ─── فقط فیلدهای ارسالی رو آپدیت کن ───
      if (dto.timezone !== undefined) contact.timezone = dto.timezone ?? null;
      if (dto.landlinePhone !== undefined)
        contact.landlinePhone = dto.landlinePhone ?? null;
      if (dto.instagramUrl !== undefined)
        contact.instagramUrl = dto.instagramUrl ?? null;
      if (dto.telegramUrl !== undefined)
        contact.telegramUrl = dto.telegramUrl ?? null;

      await queryRunner.manager.save(contact);

      // ─── ترجمه‌ها: اگه فرستاده شده → کامل جایگزین ───
      if (dto.translations) {
        await queryRunner.manager.delete(ContactTranslation, {
          contactId: contact.id,
        });

        const translations = dto.translations.map(
          (t: ContactTranslationDto) => {
            const tr = new ContactTranslation();
            tr.language = t.language;
            tr.address = t.address ?? null;
            tr.workingHours = (t.workingHours ?? []) as WorkingHour[];
            tr.contactId = contact.id;
            return tr;
          },
        );

        await queryRunner.manager.save(translations);
      }

      await queryRunner.commitTransaction();
      this.logger.log('Contact patched successfully');

      return await this.getAll();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const err = error as Error;
      this.logger.error(`Error in Contact patch: ${err.message}`, err.stack);
      throw new InternalServerErrorException(
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Error saving Contact',
      );
    } finally {
      await queryRunner.release();
    }
  }

  // ─────────────────────────────────────────────
  // POST /contact/message  (عمومی — فرم تماس)
  // ─────────────────────────────────────────────
  async submitMessage(
    dto: CreateMessageDto,
    lang: string = 'en',
    senderIp?: string,
  ): Promise<{ message: string }> {
    // ۱. ذخیره تو دیتابیس
    const newMessage = this.messageRepo.create({
      senderName: dto.senderName,
      senderEmail: dto.senderEmail,
      subject: dto.subject,
      body: dto.message,
      senderIp: senderIp ?? null,
      isRead: false,
    });
    await this.messageRepo.save(newMessage);

    // ۲. ارسال ایمیل به ادمین
    const adminEmail = process.env.ADMIN_EMAIL;
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
        this.logger.log(`Email sent to admin for message ${newMessage.id}`);
      } catch (err) {
        const e = err as Error;
        this.logger.error(`Failed to send email: ${e.message}`, e.stack);
      }
    }

    // ۳. پیام موفقیت ترجمه‌شده
    const successMessage = this.i18n.translate('contact.message_sent', {
      lang,
    });

    return { message: successMessage };
  }

  // ─────────────────────────────────────────────
  // GET /contact/admin/messages  (ادمین)
  // ─────────────────────────────────────────────
  async findAllMessages(): Promise<EmailMessage[]> {
    return this.messageRepo.find({
      order: { receivedAt: 'DESC' },
    });
  }

  // ─────────────────────────────────────────────
  // GET /contact/admin/messages/:id  (ادمین)
  // ─────────────────────────────────────────────
  async findOneMessage(id: string): Promise<EmailMessage> {
    const msg = await this.messageRepo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException('Message not found');
    return msg;
  }

  // ─────────────────────────────────────────────
  // PATCH /contact/admin/messages/:id/read  (ادمین)
  // ─────────────────────────────────────────────
  async markAsRead(id: string, isRead: boolean): Promise<EmailMessage> {
    const msg = await this.findOneMessage(id);
    msg.isRead = isRead;
    return this.messageRepo.save(msg);
  }

  // ─────────────────────────────────────────────
  // DELETE /contact/admin/messages/:id  (ادمین)
  // ─────────────────────────────────────────────
  async removeMessage(id: string): Promise<{ message: string }> {
    const msg = await this.findOneMessage(id);
    await this.messageRepo.remove(msg);
    return { message: 'Message deleted successfully' };
  }

  // ─────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────

  /**
   * اگه رکورد Contact وجود نداشت، یه رکورد خالی بساز.
   * اینطوری GET همیشه کار می‌کنه (حتی قبل از PATCH).
   */
  private async getOrCreateContact(): Promise<Contact> {
    let contact = await this.contactRepo.findOne({
      where: { id: this.FIXED_ID },
      relations: ['translations'],
    });

    if (!contact) {
      // ساخت رکورد خالی + یه ترجمه پیش‌فرض en
      contact = this.contactRepo.create({
        id: this.FIXED_ID,
        timezone: null,
        landlinePhone: null,
        instagramUrl: null,
        telegramUrl: null,
      });
      await this.contactRepo.save(contact);

      const defaultTr = new ContactTranslation();
      defaultTr.language = 'en';
      defaultTr.address = null;
      defaultTr.workingHours = [];
      defaultTr.contactId = this.FIXED_ID;
      await this.contactRepo.manager.save(defaultTr);

      // دوباره fetch کن با relations
      contact = await this.contactRepo.findOne({
        where: { id: this.FIXED_ID },
        relations: ['translations'],
      });

      this.logger.log('Default Contact record created');
    }

    return contact!;
  }

  private validateUniqueLanguages(translations: ContactTranslationDto[]): void {
    const seen = new Set<string>();
    for (const t of translations) {
      if (!SUPPORTED_LANGUAGES.includes(t.language as never)) {
        throw new BadRequestException(
          `Language "${t.language}" is not supported`,
        );
      }
      if (seen.has(t.language)) {
        throw new BadRequestException(
          `Duplicate language "${t.language}" in translations`,
        );
      }
      seen.add(t.language);
    }
  }
}
