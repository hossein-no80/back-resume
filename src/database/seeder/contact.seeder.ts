import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../../modules/contact/entities/contact.entity';
import { ContactTranslation } from '../../modules/contact/entities/contact-translation.entity';

@Injectable()
export class ContactSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(ContactSeeder.name);

  constructor(
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,
  ) {}

  async onApplicationBootstrap() {
    const existing = await this.contactRepo.findOne({ where: { id: '1' } });
    if (existing) {
      this.logger.log('ℹ️ Contact already exists, skipping seed');
      return;
    }

    this.logger.log('Seeding default Contact...');

    // ۱. ساخت رکورد اصلی Contact
    const contact = new Contact();
    contact.id = '1';
    contact.timezone = 'IRST (UTC+3:30)';
    contact.landlinePhone = '021-12345678';
    contact.instagramUrl = 'https://instagram.com/johndoe';
    contact.telegramUrl = 'https://t.me/johndoe';

    await this.contactRepo.save(contact);

    // ۲. ترجمه‌ها
    const translations: ContactTranslation[] = [];

    // ─── English ───
    const enTr = new ContactTranslation();
    enTr.language = 'en';
    enTr.address = 'San Francisco, CA 94105, USA';
    enTr.workingHours = [
      { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
      { day: 'Sunday', hours: 'Closed' },
    ];
    enTr.contactId = '1';
    translations.push(enTr);

    // ─── فارسی ───
    const faTr = new ContactTranslation();
    faTr.language = 'fa';
    faTr.address = 'تهران، خیابان آزادی، پلاک ۱۲';
    faTr.workingHours = [
      { day: 'دوشنبه تا جمعه', hours: '۹:۰۰ تا ۱۸:۰۰' },
      { day: 'شنبه', hours: '۱۰:۰۰ تا ۱۶:۰۰' },
      { day: 'یکشنبه', hours: 'تعطیل' },
    ];
    faTr.contactId = '1';
    translations.push(faTr);

    // ۳. ذخیره ترجمه‌ها
    const trRepo = this.contactRepo.manager.getRepository(ContactTranslation);
    await trRepo.save(translations);

    this.logger.log('✅ Default Contact seeded');
  }
}
