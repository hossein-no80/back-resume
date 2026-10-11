import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hero } from '../../modules/site/hero/entities/hero.entity';
import { HeroTranslation } from '../../modules/site/hero/entities/hero-translation.entity';

@Injectable()
export class HeroSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(HeroSeeder.name);

  constructor(
    @InjectRepository(Hero)
    private heroRepo: Repository<Hero>,
  ) {}

  async onApplicationBootstrap() {
    const existing = await this.heroRepo.findOne({ where: { id: 1 } });
    if (existing) {
      this.logger.log('ℹ️ Hero already exists, skipping seed');
      return;
    }

    this.logger.log('Seeding default Hero...');

    const hero = new Hero();
    hero.id = 1;
    await this.heroRepo.save(hero);

    const translations: HeroTranslation[] = [];

    // ─── English ───
    const enTr = new HeroTranslation();
    enTr.language = 'en';
    enTr.title = 'Building reliable software.';
    enTr.subtitle = 'Thinking like an attacker.';
    enTr.description =
      'I design and build modern web applications while exploring cybersecurity, web security and offensive security.';
    enTr.cta1 = 'View my work';
    enTr.cta2 = 'Explore skills';
    enTr.status = 'Available for new opportunities';
    enTr.role = 'Software Engineer · Security';
    enTr.heroId = 1;
    translations.push(enTr);

    // ─── فارسی ───
    const faTr = new HeroTranslation();
    faTr.language = 'fa';
    faTr.title = 'ساخت نرم‌افزارهای قابل اعتماد.';
    faTr.subtitle = 'تفکر مانند یک مهاجم.';
    faTr.description =
      'من برنامه‌های وب مدرن طراحی و می‌سازم و همزمان در حوزه امنیت سایبری، امنیت وب و امنیت تهاجمی را بررسی می‌کنم.';
    faTr.cta1 = 'مشاهده کارهای من';
    faTr.cta2 = 'مهارت‌ها را ببینید';
    faTr.status = 'آماده همکاری برای پروژه‌های جدید';
    faTr.role = 'مهندس نرم‌افزار · امنیت';
    faTr.heroId = 1;
    translations.push(faTr);

    const trRepo = this.heroRepo.manager.getRepository(HeroTranslation);
    await trRepo.save(translations);

    this.logger.log('✅ Default Hero seeded');
  }
}
