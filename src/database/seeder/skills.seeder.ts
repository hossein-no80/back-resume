import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillCategory } from '../../modules/skills/entities/skill-category.entity';
import { SkillCategoryTranslation } from '../../modules/skills/entities/skill-category-translation.entity';
import { SkillItem } from '../../modules/skills/entities/skill-item.entity';
import { SkillItemTranslation } from '../../modules/skills/entities/skill-item-translation.entity';

@Injectable()
export class SkillsSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(SkillsSeeder.name);

  constructor(
    @InjectRepository(SkillCategory)
    private categoryRepo: Repository<SkillCategory>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.categoryRepo.count();
    if (count > 0) {
      this.logger.log('ℹ️ Skills already exist, skipping seed');
      return;
    }

    this.logger.log('Seeding default Skills...');

    const data = [
      {
        key: 'engineering',
        icon: 'Code2',
        order: 0,
        titleEn: 'Engineering',
        titleFa: 'مهندسی',
        descEn: 'Core software engineering skills',
        descFa: 'مهارت‌های اصلی مهندسی نرم‌افزار',
        skills: [
          {
            level: 5,
            years: 5,
            order: 0,
            name: 'TypeScript / JavaScript',
            descEn: 'Expert in modern JS/TS development',
            descFa: 'متخصص در توسعه مدرن JS/TS',
          },
          {
            level: 5,
            years: 4,
            order: 1,
            name: 'React & Next.js',
            descEn: 'Building production-grade applications',
            descFa: 'ساخت اپلیکیشن‌های Production',
          },
          {
            level: 4,
            years: 4,
            order: 2,
            name: 'Node.js',
            descEn: 'Backend development & APIs',
            descFa: 'توسعه بک‌اند و API',
          },
          {
            level: 3,
            years: 3,
            order: 3,
            name: 'Python',
            descEn: 'Scripting & automation',
            descFa: 'اسکریپت‌نویسی و اتوماسیون',
          },
        ],
      },
      {
        key: 'security',
        icon: 'Shield',
        order: 1,
        titleEn: 'Security',
        titleFa: 'امنیت',
        descEn: 'Web & application security',
        descFa: 'امنیت وب و برنامه',
        skills: [
          {
            level: 4,
            years: 3,
            order: 0,
            name: 'Web Security',
            descEn: 'OWASP Top 10, secure coding',
            descFa: 'OWASP Top 10 و کدنویسی امن',
          },
          {
            level: 3,
            years: 2,
            order: 1,
            name: 'Penetration Testing',
            descEn: 'Ethical hacking & vulnerability assessment',
            descFa: 'هک اخلاقی و ارزیابی آسیب‌پذیری',
          },
          {
            level: 4,
            years: 3,
            order: 2,
            name: 'Authentication & AuthZ',
            descEn: 'JWT, OAuth, RBAC',
            descFa: 'JWT، OAuth و RBAC',
          },
          {
            level: 3,
            years: 2,
            order: 3,
            name: 'Security Hardening',
            descEn: 'Secure configurations & best practices',
            descFa: 'تنظیمات امن و بهترین روش‌ها',
          },
        ],
      },
      {
        key: 'fullstack',
        icon: 'Server',
        order: 2,
        titleEn: 'Full Stack',
        titleFa: 'فول‌استک',
        descEn: 'End-to-end development',
        descFa: 'توسعه از ابتدا تا انتها',
        skills: [
          {
            level: 5,
            years: 5,
            order: 0,
            name: 'Frontend Architecture',
            descEn: 'Scalable component design & state management',
            descFa: 'طراحی کامپوننت و مدیریت State مقیاس‌پذیر',
          },
          {
            level: 4,
            years: 4,
            order: 1,
            name: 'Backend Development',
            descEn: 'REST APIs, microservices',
            descFa: 'REST API و میکروسرویس',
          },
          {
            level: 4,
            years: 4,
            order: 2,
            name: 'Database Design',
            descEn: 'PostgreSQL, MongoDB, Redis',
            descFa: 'PostgreSQL، MongoDB و Redis',
          },
          {
            level: 3,
            years: 3,
            order: 3,
            name: 'DevOps & Cloud',
            descEn: 'AWS, Docker, CI/CD',
            descFa: 'AWS، Docker و CI/CD',
          },
        ],
      },
      {
        key: 'tools',
        icon: 'GitBranch',
        order: 3,
        titleEn: 'Tools & Practices',
        titleFa: 'ابزارها و روش‌ها',
        descEn: 'Development tools & workflows',
        descFa: 'ابزارهای توسعه و گردش کار',
        skills: [
          {
            level: 5,
            years: 5,
            order: 0,
            name: 'Git & GitHub',
            descEn: 'Version control & collaboration',
            descFa: 'کنترل نسخه و همکاری',
          },
          {
            level: 4,
            years: 4,
            order: 1,
            name: 'Linux & Terminal',
            descEn: 'System administration & scripting',
            descFa: 'مدیریت سیستم و اسکریپت‌نویسی',
          },
          {
            level: 4,
            years: 3,
            order: 2,
            name: 'Testing & QA',
            descEn: 'Unit, integration & E2E testing',
            descFa: 'تست واحد، یکپارچگی و E2E',
          },
          {
            level: 4,
            years: 4,
            order: 3,
            name: 'Agile & Scrum',
            descEn: 'Agile methodologies & project management',
            descFa: 'متدولوژی Agile و مدیریت پروژه',
          },
        ],
      },
    ];

    // درج دسته‌ها با cascade
    for (const catData of data) {
      const category = new SkillCategory();
      category.key = catData.key;
      category.icon = catData.icon;
      category.order = catData.order;

      // ترجمه‌های دسته
      const catEn = new SkillCategoryTranslation();
      catEn.language = 'en';
      catEn.title = catData.titleEn;
      catEn.description = catData.descEn;

      const catFa = new SkillCategoryTranslation();
      catFa.language = 'fa';
      catFa.title = catData.titleFa;
      catFa.description = catData.descFa;

      category.translations = [catEn, catFa];

      // مهارت‌ها
      category.skills = catData.skills.map((s) => {
        const item = new SkillItem();
        item.level = s.level;
        item.years = s.years;
        item.order = s.order;

        const itemEn = new SkillItemTranslation();
        itemEn.language = 'en';
        itemEn.name = s.name;
        itemEn.description = s.descEn;

        const itemFa = new SkillItemTranslation();
        itemFa.language = 'fa';
        itemFa.name = s.name; // اسم تکنولوژی فارسی نمی‌شه
        itemFa.description = s.descFa;

        item.translations = [itemEn, itemFa];
        return item;
      });

      await this.categoryRepo.save(category);
    }

    this.logger.log(`✅ Default Skills seeded (${data.length} categories)`);
  }
}
