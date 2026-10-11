import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { About } from '../../modules/about/entities/about.entity';
import { AboutTranslation } from '../../modules/about/entities/about-translation.entity';

@Injectable()
export class AboutSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(AboutSeeder.name);

  constructor(
    @InjectRepository(About) private aboutRepo: Repository<About>,
    @InjectRepository(AboutTranslation)
    private trRepo: Repository<AboutTranslation>,
  ) {}

  async onApplicationBootstrap() {
    const existing = await this.aboutRepo.findOne({ where: { id: 1 } });
    if (existing) {
      this.logger.log('ℹ️ About already exists, skipping seed');
      return;
    }

    this.logger.log('Seeding default About...');

    const about = this.aboutRepo.create({
      id: 1,
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      avatar: '',
      resumeUrl: '/resume.pdf',
      resumeFileName: 'John_Doe_Resume.pdf',
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe',
      youtube: 'https://youtube.com/@johndoe',
      website: 'https://johndoe.dev',
      available: true,
      openToWork: true,
    });
    await this.aboutRepo.save(about);

    const translations: Partial<AboutTranslation>[] = [
      {
        aboutId: 1,
        language: 'en',
        name: 'John Doe',
        title: 'Software Engineer · Security',
        heading: 'Engineering systems. Understanding how they work.',
        bio: "I'm a software engineer focused on building modern, reliable and scalable web applications.",
        location: 'San Francisco, CA',
        aboutSections: [
          {
            id: 'sec-1',
            icon: 'Code2',
            order: 0,
            title: 'My Background',
            content:
              "I'm a software engineer focused on building modern, reliable and scalable web applications.",
          },
          {
            id: 'sec-2',
            icon: 'Server',
            order: 1,
            title: 'Full Stack Development',
            content:
              'My background in full-stack development gives me a broad understanding of how digital products are designed, built and maintained.',
          },
          {
            id: 'sec-3',
            icon: 'Shield',
            order: 2,
            title: 'Security Focus',
            content:
              "Alongside software engineering, I'm expanding my knowledge in cybersecurity and web security.",
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
          {
            id: 'exp-2',
            icon: 'Terminal',
            order: 1,
            title: 'Full Stack',
            description: 'From UI to backend.',
          },
          {
            id: 'exp-3',
            icon: 'ShieldCheck',
            order: 2,
            title: 'Security',
            description: 'Secure by design.',
          },
        ],
      },
      {
        aboutId: 1,
        language: 'fa',
        name: 'حسین رضایی',
        title: 'مهندس نرم‌افزار · امنیت',
        heading: 'مهندسی سیستم‌ها. درک نحوه کار آن‌ها.',
        bio: 'من یک مهندس نرم‌افزار هستم که بر ساخت برنامه‌های وب مدرن، قابل اعتماد و مقیاس‌پذیر متمرکز شده‌ام.',
        location: 'تهران، ایران',
        aboutSections: [
          {
            id: 'sec-1',
            icon: 'Code2',
            order: 0,
            title: 'پیشینه من',
            content: 'من یک مهندس نرم‌افزار هستم...',
          },
          {
            id: 'sec-2',
            icon: 'Server',
            order: 1,
            title: 'توسعه فول‌استک',
            content: 'پیشینه من در توسعه فول‌استک...',
          },
          {
            id: 'sec-3',
            icon: 'Shield',
            order: 2,
            title: 'تمرکز بر امنیت',
            content: 'در کنار مهندسی نرم‌افزار...',
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
          {
            id: 'exp-2',
            icon: 'Terminal',
            order: 1,
            title: 'فول‌استک',
            description: 'از رابط کاربری تا بک‌اند.',
          },
          {
            id: 'exp-3',
            icon: 'ShieldCheck',
            order: 2,
            title: 'امنیت',
            description: 'امن از ابتدا.',
          },
        ],
      },
    ];

    await this.trRepo.save(translations as AboutTranslation[]);
    this.logger.log('✅ Default About seeded');
  }
}
