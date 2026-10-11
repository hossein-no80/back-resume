import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../../modules/experience/entities/experience.entity';
import { ExperienceTranslation } from '../../modules/experience/entities/experience-translation.entity';
import { ExperienceType } from '../../modules/experience/enums/experience-type.enum';

@Injectable()
export class ExperienceSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(ExperienceSeeder.name);

  constructor(
    @InjectRepository(Experience)
    private experienceRepo: Repository<Experience>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.experienceRepo.count();
    if (count > 0) {
      this.logger.log('ℹ️ Experience already exists, skipping seed');
      return;
    }

    this.logger.log('Seeding default Experience...');

    const data = [
      {
        company: 'TechCorp Inc.',
        companyLogo: null,
        startDate: 'Jan 2024',
        endDate: null, // present
        type: ExperienceType.FULL_TIME,
        website: 'https://techcorp.com',
        featured: true,
        order: 0,
        technologies: [
          'Next.js',
          'TypeScript',
          'Node.js',
          'PostgreSQL',
          'Redis',
          'Docker',
          'Kubernetes',
          'AWS',
        ],
        en: {
          position: 'Senior Full Stack Developer',
          location: 'San Francisco, CA (Remote)',
          industry: 'FinTech',
          description: [
            'Leading the development of a next-gen financial trading platform serving 50,000+ active users.',
            'Architecting microservices infrastructure using Node.js, TypeScript, and Docker.',
            'Implementing real-time data processing with WebSocket and Redis.',
            'Mentoring a team of 5 junior developers and conducting code reviews.',
          ],
          achievements: [
            'Reduced API response time by 45% through query optimization and caching strategies.',
            'Led migration from monolith to microservices with zero downtime.',
            'Implemented comprehensive security measures including OAuth2 and JWT authentication.',
            'Introduced CI/CD pipeline reducing deployment time by 60%.',
          ],
        },
        fa: {
          position: 'توسعه‌دهنده ارشد فول‌استک',
          location: 'سان‌فرانسیسکو (دورکاری)',
          industry: 'فین‌تک',
          description: [
            'رهبری توسعه پلتفرم معاملاتی نسل جدید با بیش از ۵۰,۰۰۰ کاربر فعال.',
            'طراحی معماری میکروسرویس با استفاده از Node.js، TypeScript و Docker.',
            'پیاده‌سازی پردازش داده لحظه‌ای با WebSocket و Redis.',
            'منتورینگ تیم ۵ نفره از توسعه‌دهندگان و بازبینی کد.',
          ],
          achievements: [
            'کاهش ۴۵٪ زمان پاسخ API از طریق بهینه‌سازی query و استراتژی‌های کش.',
            'رهبری مهاجرت از monolith به میکروسرویس با صفر downtime.',
            'پیاده‌سازی اقدامات امنیتی جامع شامل OAuth2 و احراز هویت JWT.',
            'معرفی خط لوله CI/CD با کاهش ۶۰٪ زمان استقرار.',
          ],
        },
      },
      {
        company: 'SecureNet Solutions',
        companyLogo: null,
        startDate: 'Jun 2022',
        endDate: 'Dec 2023',
        type: ExperienceType.FULL_TIME,
        website: 'https://securenet.com',
        featured: false,
        order: 1,
        technologies: [
          'Python',
          'Burp Suite',
          'OWASP',
          'Kali Linux',
          'Metasploit',
          'Wireshark',
          'Nessus',
          'JWT',
        ],
        en: {
          position: 'Security Engineer',
          location: 'Austin, TX (Hybrid)',
          industry: 'Cybersecurity',
          description: [
            'Developed and maintained security tools for vulnerability assessment and penetration testing.',
            'Conducted security audits for 20+ enterprise clients across various industries.',
            'Implemented security best practices and compliance frameworks (SOC2, ISO 27001).',
            'Collaborated with development teams to remediate security vulnerabilities.',
          ],
          achievements: [
            'Identified and mitigated 150+ critical vulnerabilities in client applications.',
            'Developed automated security scanning tool used by 100+ companies.',
            'Reduced security incident response time from 4 hours to 30 minutes.',
            'Achieved 100% compliance with SOC2 and ISO 27001 standards.',
          ],
        },
        fa: {
          position: 'مهندس امنیت',
          location: 'آستین، تگزاس (هیبرید)',
          industry: 'امنیت سایبری',
          description: [
            'توسعه و نگهداری ابزارهای امنیتی برای ارزیابی آسیب‌پذیری و تست نفوذ.',
            'انجام ممیزی امنیتی برای بیش از ۲۰ مشتری سازمانی در صنایع مختلف.',
            'پیاده‌سازی بهترین شیوه‌های امنیتی و چارچوب‌های انطباق (SOC2، ISO 27001).',
            'همکاری با تیم‌های توسعه برای رفع آسیب‌پذیری‌های امنیتی.',
          ],
          achievements: [
            'شناسایی و رفع بیش از ۱۵۰ آسیب‌پذیری حیاتی در اپلیکیشن‌های مشتریان.',
            'توسعه ابزار اسکن امنیتی خودکار که توسط بیش از ۱۰۰ شرکت استفاده می‌شه.',
            'کاهش زمان پاسخ به حادثه امنیتی از ۴ ساعت به ۳۰ دقیقه.',
            'دستیابی به ۱۰۰٪ انطباق با استانداردهای SOC2 و ISO 27001.',
          ],
        },
      },
      {
        company: 'DevSphere Technologies',
        companyLogo: null,
        startDate: 'Jan 2021',
        endDate: 'May 2022',
        type: ExperienceType.FULL_TIME,
        website: 'https://devsphere.com',
        featured: false,
        order: 2,
        technologies: [
          'React',
          'TypeScript',
          'Node.js',
          'MongoDB',
          'Express',
          'WebSocket',
          'Jest',
          'Git',
        ],
        en: {
          position: 'Full Stack Developer',
          location: 'Toronto, Canada (Remote)',
          industry: 'SaaS',
          description: [
            'Built and maintained scalable web applications for enterprise clients.',
            'Developed RESTful APIs and microservices using Node.js and Express.',
            'Created responsive user interfaces with React, TypeScript, and Tailwind CSS.',
            'Implemented real-time features using WebSocket and Socket.io.',
          ],
          achievements: [
            'Built a SaaS platform serving 10,000+ monthly active users.',
            'Reduced codebase size by 30% through code refactoring and optimization.',
            'Implemented comprehensive test suite with 90%+ code coverage.',
            'Designed and implemented a reusable component library used across 5+ projects.',
          ],
        },
        fa: {
          position: 'توسعه‌دهنده فول‌استک',
          location: 'تورنتو، کانادا (دورکاری)',
          industry: 'SaaS',
          description: [
            'ساخت و نگهداری اپلیکیشن‌های وب مقیاس‌پذیر برای مشتریان سازمانی.',
            'توسعه RESTful API و میکروسرویس با Node.js و Express.',
            'ساخت رابط‌های کاربری پاسخگو با React، TypeScript و Tailwind CSS.',
            'پیاده‌سازی ویژگی‌های لحظه‌ای با WebSocket و Socket.io.',
          ],
          achievements: [
            'ساخت پلتفرم SaaS با بیش از ۱۰,۰۰۰ کاربر فعال ماهانه.',
            'کاهش ۳۰٪ اندازه کد از طریق بازنویسی و بهینه‌سازی.',
            'پیاده‌سازی مجموعه تست جامع با بیش از ۹۰٪ پوشش کد.',
            'طراحی و پیاده‌سازی کتابخانه کامپوننت قابل استفاده مجدد در بیش از ۵ پروژه.',
          ],
        },
      },
      {
        company: 'OpenSource Community',
        companyLogo: null,
        startDate: 'Mar 2020',
        endDate: null,
        type: ExperienceType.FREELANCE,
        website: null,
        featured: true,
        order: 3,
        technologies: [
          'TypeScript',
          'Python',
          'Security',
          'Node.js',
          'Git',
          'Docker',
          'Open Source',
        ],
        en: {
          position: 'Open Source Contributor & Maintainer',
          location: 'Global (Remote)',
          industry: 'Open Source',
          description: [
            'Active contributor to several open-source projects in the security and web development ecosystem.',
            'Maintainer of a popular security scanning tool with 2,000+ GitHub stars.',
            'Regularly reviewing pull requests and mentoring new contributors.',
          ],
          achievements: [
            'Contributed to 15+ open-source projects including Next.js, Node.js, and security tools.',
            'Created and maintain 3 popular open-source libraries with 5,000+ monthly downloads.',
            'Organized 5 hackathons and open-source workshops with 200+ participants.',
            'Recognized as a GitHub Star for contributions to the open-source community.',
          ],
        },
        fa: {
          position: 'مشارکت‌کننده و نگهدارنده متن‌باز',
          location: 'جهانی (دورکاری)',
          industry: 'متن‌باز',
          description: [
            'مشارکت‌کننده فعال در چندین پروژه متن‌باز در اکوسیستم امنیت و توسعه وب.',
            'نگهدارنده یک ابزار محبوب اسکن امنیتی با بیش از ۲,۰۰۰ ستاره GitHub.',
            'بازبینی منظم pull requestها و منتورینگ مشارکت‌کنندگان جدید.',
          ],
          achievements: [
            'مشارکت در بیش از ۱۵ پروژه متن‌باز شامل Next.js، Node.js و ابزارهای امنیتی.',
            'ایجاد و نگهداری ۳ کتابخانه متن‌باز محبوب با بیش از ۵,۰۰۰ دانلود ماهانه.',
            'برگزاری ۵ هکاتون و کارگاه متن‌باز با بیش از ۲۰۰ شرکت‌کننده.',
            'شناسایی به‌عنوان GitHub Star برای مشارکت در جامعه متن‌باز.',
          ],
        },
      },
      {
        company: 'StartupHub Inc.',
        companyLogo: null,
        startDate: 'Sep 2019',
        endDate: 'Dec 2019',
        type: ExperienceType.INTERNSHIP,
        website: null,
        featured: false,
        order: 4,
        technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Git', 'Agile'],
        en: {
          position: 'Full Stack Developer Intern',
          location: 'Berlin, Germany',
          industry: 'Tech Startup',
          description: [
            'Assisted in developing MVP for a social networking platform.',
            'Worked on frontend development using React and backend APIs.',
            'Participated in agile development and daily stand-ups.',
          ],
          achievements: [
            'Developed 3 key features that were shipped to production.',
            'Reduced app load time by 25% through optimization techniques.',
            'Created comprehensive documentation for the API.',
          ],
        },
        fa: {
          position: 'کارآموز توسعه فول‌استک',
          location: 'برلین، آلمان',
          industry: 'استارتاپ فناوری',
          description: [
            'کمک در توسعه MVP برای یک پلتفرم شبکه اجتماعی.',
            'کار روی توسعه فرانت‌اند با React و APIهای بک‌اند.',
            'مشارکت در توسعه Agile و جلسات روزانه.',
          ],
          achievements: [
            'توسعه ۳ ویژگی کلیدی که به production منتشر شدن.',
            'کاهش ۲۵٪ زمان بارگذاری اپ از طریق تکنیک‌های بهینه‌سازی.',
            'ایجاد مستندات جامع برای API.',
          ],
        },
      },
    ];

    for (const expData of data) {
      const experience = new Experience();
      experience.company = expData.company;
      experience.companyLogo = expData.companyLogo;
      experience.startDate = expData.startDate;
      experience.endDate = expData.endDate;
      experience.type = expData.type;
      experience.website = expData.website;
      experience.featured = expData.featured;
      experience.order = expData.order;
      experience.technologies = expData.technologies;

      // ذخیره تجربه
      const savedExp = await this.experienceRepo.save(experience);

      // ترجمه‌ها
      const translations: ExperienceTranslation[] = [];

      const enTr = new ExperienceTranslation();
      enTr.language = 'en';
      enTr.position = expData.en.position;
      enTr.location = expData.en.location;
      enTr.industry = expData.en.industry;
      enTr.description = expData.en.description;
      enTr.achievements = expData.en.achievements;
      enTr.experienceId = savedExp.id;
      translations.push(enTr);

      const faTr = new ExperienceTranslation();
      faTr.language = 'fa';
      faTr.position = expData.fa.position;
      faTr.location = expData.fa.location;
      faTr.industry = expData.fa.industry;
      faTr.description = expData.fa.description;
      faTr.achievements = expData.fa.achievements;
      faTr.experienceId = savedExp.id;
      translations.push(faTr);

      // ذخیره ترجمه‌ها
      const trRepo =
        this.experienceRepo.manager.getRepository(ExperienceTranslation);
      await trRepo.save(translations);
    }

    this.logger.log(`✅ Default Experience seeded (${data.length} items)`);
  }
}
