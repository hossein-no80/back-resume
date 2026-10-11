import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../modules/projects/entities/project.entity';
import { ProjectTranslation } from '../../modules/projects/entities/project-translation.entity';
import {
  ProjectCategory,
  ProjectStatus,
} from '../../modules/projects/enums/project.enums';

@Injectable()
export class ProjectsSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(ProjectsSeeder.name);

  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.projectRepo.count();
    if (count > 0) {
      this.logger.log('ℹ️ Projects already exist, skipping seed');
      return;
    }

    this.logger.log('Seeding default Projects...');

    const data = [
      {
        category: ProjectCategory.SECURITY,
        image: null,
        githubUrl: 'https://github.com/yourusername/secureauth-pro',
        liveUrl: 'https://secureauth-pro.com',
        techStack: [
          'Next.js',
          'TypeScript',
          'Node.js',
          'PostgreSQL',
          'Redis',
          'JWT',
        ],
        date: '2025',
        status: ProjectStatus.ACTIVE,
        featured: true,
        order: 0,
        statsStars: 128,
        statsForks: 34,
        statsViews: 4200,
        statsUsers: null,
        en: {
          title: 'SecureAuth Pro',
          description:
            'Enterprise authentication system with advanced security features',
          longDescription:
            'A comprehensive authentication and authorization system designed for enterprise applications. Implements OAuth 2.0, JWT, multi-factor authentication, and role-based access control with advanced security hardening.',
          tags: ['Authentication', 'Security', 'Enterprise'],
          features: [
            'Multi-factor authentication (MFA)',
            'OAuth 2.0 integration',
            'Role-based access control (RBAC)',
            'Session management with Redis',
            'Security audit logging',
            'Rate limiting & brute force protection',
          ],
        },
        fa: {
          title: 'سیستم احراز هویت امن',
          description: 'سیستم احراز هویت سازمانی با ویژگی‌های امنیتی پیشرفته',
          longDescription:
            'یک سیستم جامع احراز هویت و مجوزدهی برای اپلیکیشن‌های سازمانی. پیاده‌سازی OAuth 2.0، JWT، احراز هویت چندعاملی و کنترل دسترسی بر اساس نقش با سخت‌سازی امنیتی پیشرفته.',
          tags: ['احراز هویت', 'امنیت', 'سازمانی'],
          features: [
            'احراز هویت چندعاملی (MFA)',
            'ادغام OAuth 2.0',
            'کنترل دسترسی بر اساس نقش (RBAC)',
            'مدیریت نشست با Redis',
            'ثبت لاگ ممیزی امنیتی',
            'Rate limiting و محافظت از brute force',
          ],
        },
      },
      {
        category: ProjectCategory.FULLSTACK,
        image: null,
        githubUrl: 'https://github.com/yourusername/devops-dashboard',
        liveUrl: 'https://devops-dashboard.com',
        techStack: [
          'React',
          'Node.js',
          'WebSocket',
          'Docker',
          'Kubernetes',
          'Prometheus',
        ],
        date: '2025',
        status: ProjectStatus.ACTIVE,
        featured: true,
        order: 1,
        statsStars: 89,
        statsForks: 23,
        statsViews: 3100,
        statsUsers: null,
        en: {
          title: 'DevOps Dashboard',
          description:
            'Real-time infrastructure monitoring and deployment management',
          longDescription:
            'A modern DevOps dashboard providing real-time visibility into infrastructure health, deployment status, and system performance metrics with automated alerting and incident management.',
          tags: ['DevOps', 'Monitoring', 'Dashboard'],
          features: [
            'Real-time infrastructure monitoring',
            'Deployment pipeline tracking',
            'Automated alerting system',
            'Performance metrics visualization',
            'Incident management',
            'Custom dashboard builder',
          ],
        },
        fa: {
          title: 'داشبورد DevOps',
          description: 'مانیتورینگ زیرساخت و مدیریت استقرار در زمان واقعی',
          longDescription:
            'یک داشبورد مدرن DevOps که دید لحظه‌ای به سلامت زیرساخت، وضعیت استقرار و معیارهای عملکرد سیستم با هشدارهای خودکار و مدیریت رخداد فراهم می‌کنه.',
          tags: ['DevOps', 'مانیتورینگ', 'داشبورد'],
          features: [
            'مانیتورینگ زیرساخت در زمان واقعی',
            'ردیابی خط لوله استقرار',
            'سیستم هشدار خودکار',
            'بصری‌سازی معیارهای عملکرد',
            'مدیریت رخداد',
            'سازنده داشبورد سفارشی',
          ],
        },
      },
      {
        category: ProjectCategory.SECURITY,
        image: null,
        githubUrl: 'https://github.com/yourusername/vulnscanner-cli',
        liveUrl: null,
        techStack: [
          'Python',
          'Requests',
          'BeautifulSoup',
          'Click',
          'ReportLab',
        ],
        date: '2024',
        status: ProjectStatus.ACTIVE,
        featured: true,
        order: 2,
        statsStars: 213,
        statsForks: 67,
        statsViews: 5800,
        statsUsers: null,
        en: {
          title: 'VulnScanner CLI',
          description:
            'Command-line vulnerability scanner for web applications',
          longDescription:
            'A powerful CLI tool for identifying common web vulnerabilities in applications. Scans for OWASP Top 10 vulnerabilities, performs security headers analysis, and generates detailed security reports.',
          tags: ['Security', 'CLI', 'Pentesting'],
          features: [
            'OWASP Top 10 vulnerability scanning',
            'Security headers analysis',
            'SSL/TLS configuration check',
            'Automated security report generation',
            'CI/CD pipeline integration',
            'Custom rule configuration',
          ],
        },
        fa: {
          title: 'اسکنر آسیب‌پذیری CLI',
          description: 'اسکنر آسیب‌پذیری خط فرمان برای اپلیکیشن‌های وب',
          longDescription:
            'یک ابزار قدرتمند CLI برای شناسایی آسیب‌پذیری‌های رایج وب در اپلیکیشن‌ها. اسکن OWASP Top 10، تحلیل هدرهای امنیتی و تولید گزارش‌های امنیتی دقیق.',
          tags: ['امنیت', 'CLI', 'تست نفوذ'],
          features: [
            'اسکن آسیب‌پذیری OWASP Top 10',
            'تحلیل هدرهای امنیتی',
            'بررسی پیکربندی SSL/TLS',
            'تولید خودکار گزارش امنیتی',
            'ادغام با خط لوله CI/CD',
            'پیکربندی قوانین سفارشی',
          ],
        },
      },
      {
        category: ProjectCategory.WEB,
        image: null,
        githubUrl: 'https://github.com/yourusername/portfolio-builder',
        liveUrl: 'https://portfolio-builder.com',
        techStack: [
          'Next.js',
          'TypeScript',
          'OpenAI',
          'Tailwind CSS',
          'Framer Motion',
        ],
        date: '2024',
        status: ProjectStatus.ACTIVE,
        featured: false,
        order: 3,
        statsStars: 156,
        statsForks: 42,
        statsViews: 4900,
        statsUsers: null,
        en: {
          title: 'Modern Portfolio Builder',
          description: 'AI-powered portfolio website generator for developers',
          longDescription:
            'An intelligent portfolio generator that uses AI to create professional portfolio websites. Simply input your details and get a fully customized, responsive portfolio with modern design patterns.',
          tags: ['AI', 'Portfolio', 'Generator'],
          features: [
            'AI-powered content generation',
            'Multiple design templates',
            'Dark/light theme support',
            'SEO optimization',
            'Analytics integration',
            'One-click deployment',
          ],
        },
        fa: {
          title: 'سازنده پورتفولیوی مدرن',
          description:
            'تولیدکننده وبسایت پورتفولیو مبتنی بر هوش مصنوعی برای توسعه‌دهندگان',
          longDescription:
            'یک تولیدکننده هوشمند پورتفولیو که از هوش مصنوعی برای ساخت وبسایت‌های حرفه‌ای استفاده می‌کنه. فقط اطلاعاتت رو وارد کن و یه پورتفولیوی کاملاً سفارشی و واکنش‌گرا دریافت کن.',
          tags: ['هوش مصنوعی', 'پورتفولیو', 'تولیدکننده'],
          features: [
            'تولید محتوا با هوش مصنوعی',
            'قالب‌های طراحی متعدد',
            'پشتیبانی از تم تاریک/روشن',
            'بهینه‌سازی SEO',
            'ادغام با آنالیتیکس',
            'استقرار با یک کلیک',
          ],
        },
      },
      {
        category: ProjectCategory.MOBILE,
        image: null,
        githubUrl: 'https://github.com/yourusername/securechat',
        liveUrl: null,
        techStack: [
          'React Native',
          'WebSocket',
          'WebRTC',
          'AES-256',
          'Firebase',
        ],
        date: '2024',
        status: ProjectStatus.IN_DEVELOPMENT,
        featured: false,
        order: 4,
        statsStars: null,
        statsForks: null,
        statsViews: null,
        statsUsers: null,
        en: {
          title: 'SecureChat App',
          description: 'End-to-end encrypted messaging platform',
          longDescription:
            'A secure messaging application with end-to-end encryption, self-destructing messages, and secure file sharing. Built with WebSocket for real-time communication and WebRTC for video calls.',
          tags: ['Encryption', 'Real-time', 'Mobile'],
          features: [
            'End-to-end encryption',
            'Self-destructing messages',
            'Secure file sharing',
            'Voice and video calls',
            'Group chat with moderation',
            'Biometric authentication',
          ],
        },
        fa: {
          title: 'اپلیکیشن SecureChat',
          description: 'پلتفرم پیام‌رسان با رمزنگاری سرتاسری',
          longDescription:
            'یک اپلیکیشن پیام‌رسان امن با رمزنگاری سرتاسری، پیام‌های خودتخریب و اشتراک‌گذاری فایل امن. ساخته شده با WebSocket برای ارتباط لحظه‌ای و WebRTC برای تماس تصویری.',
          tags: ['رمزنگاری', 'لحظه‌ای', 'موبایل'],
          features: [
            'رمزنگاری سرتاسری',
            'پیام‌های خودتخریب',
            'اشتراک‌گذاری امن فایل',
            'تماس صوتی و تصویری',
            'چت گروهی با مدیریت',
            'احراز هویت بیومتریک',
          ],
        },
      },
      {
        category: ProjectCategory.OPENSOURCE,
        image: null,
        githubUrl: 'https://github.com/yourusername/opensource-toolkit',
        liveUrl: null,
        techStack: ['TypeScript', 'Node.js', 'ESLint', 'Jest', 'Webpack'],
        date: '2023',
        status: ProjectStatus.ACTIVE,
        featured: true,
        order: 5,
        statsStars: 342,
        statsForks: 98,
        statsViews: 8700,
        statsUsers: null,
        en: {
          title: 'OpenSource Toolkit',
          description: 'Collection of essential open-source development tools',
          longDescription:
            'A curated collection of open-source tools and utilities for developers. Includes code generators, testing frameworks, and security analysis tools with comprehensive documentation.',
          tags: ['Open Source', 'Tools', 'Community'],
          features: [
            'Automated code generation',
            'Testing framework integration',
            'Security scanning tools',
            'Documentation generator',
            'Plugin system',
            'Community contributions',
          ],
        },
        fa: {
          title: 'جعبه‌ابزار متن‌باز',
          description: 'مجموعه‌ای از ابزارهای توسعه متن‌باز ضروری',
          longDescription:
            'مجموعه‌ای گلچین‌شده از ابزارها و utilities متن‌باز برای توسعه‌دهندگان. شامل تولیدکننده کد، چارچوب‌های تست و ابزارهای تحلیل امنیتی با مستندات جامع.',
          tags: ['متن‌باز', 'ابزارها', 'جامعه'],
          features: [
            'تولید خودکار کد',
            'ادغام چارچوب تست',
            'ابزارهای اسکن امنیتی',
            'تولیدکننده مستندات',
            'سیستم پلاگین',
            'مشارکت‌های جامعه',
          ],
        },
      },
    ];

    for (const pData of data) {
      const project = new Project();
      project.category = pData.category;
      project.image = pData.image;
      project.githubUrl = pData.githubUrl;
      project.liveUrl = pData.liveUrl;
      project.techStack = pData.techStack;
      project.date = pData.date;
      project.status = pData.status;
      project.featured = pData.featured;
      project.order = pData.order;
      project.statsStars = pData.statsStars;
      project.statsForks = pData.statsForks;
      project.statsViews = pData.statsViews;
      project.statsUsers = pData.statsUsers;

      const savedProject = await this.projectRepo.save(project);

      // Translations
      const translations: ProjectTranslation[] = [];

      const enTr = new ProjectTranslation();
      enTr.language = 'en';
      enTr.title = pData.en.title;
      enTr.description = pData.en.description;
      enTr.longDescription = pData.en.longDescription;
      enTr.tags = pData.en.tags;
      enTr.features = pData.en.features;
      enTr.projectId = savedProject.id;
      translations.push(enTr);

      const faTr = new ProjectTranslation();
      faTr.language = 'fa';
      faTr.title = pData.fa.title;
      faTr.description = pData.fa.description;
      faTr.longDescription = pData.fa.longDescription;
      faTr.tags = pData.fa.tags;
      faTr.features = pData.fa.features;
      faTr.projectId = savedProject.id;
      translations.push(faTr);

      // ذخیره ترجمه‌ها
      const trRepo = this.projectRepo.manager.getRepository(ProjectTranslation);
      await trRepo.save(translations);
    }

    this.logger.log(`✅ Default Projects seeded (${data.length} items)`);
  }
}
