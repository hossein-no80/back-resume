import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from '../../modules/blog/entities/blog-post.entity';
import { BlogPostTranslation } from '../../modules/blog/entities/blog-post-translation.entity';
import { BlogCategory } from '../../modules/blog/enums/blog-category.enum';

@Injectable()
export class BlogSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(BlogSeeder.name);

  constructor(
    @InjectRepository(BlogPost)
    private postRepo: Repository<BlogPost>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.postRepo.count();
    if (count > 0) {
      this.logger.log('ℹ️ Blog already exists, skipping seed');
      return;
    }

    this.logger.log('Seeding default Blog posts...');

    const data = [
      {
        slug: 'securing-nextjs-application-guide',
        category: BlogCategory.SECURITY,
        authorName: 'John Doe',
        authorAvatar: null,
        date: '2025-03-15',
        readTime: 12,
        coverImage: '/blog/security-nextjs.jpg',
        statsViews: 2847,
        statsLikes: 342,
        statsComments: 28,
        featured: true,
        published: true,
        order: 0,
        en: {
          title: 'Securing Your Next.js Application: A Comprehensive Guide',
          excerpt:
            'Learn essential security practices for Next.js applications including authentication, authorization, input validation, and protection against common web vulnerabilities.',
          intro:
            'Modern software development is not only about making a feature work. Architecture, security, maintainability and developer experience all contribute to the quality of the final product.',
          authorRole: 'Senior Security Engineer',
          tags: ['Next.js', 'Security', 'Authentication', 'OWASP'],
          sections: [
            {
              title: 'Introduction',
              content:
                'Modern software development is not only about making a feature work. Architecture, security, maintainability and developer experience all contribute to the quality of the final product.',
            },
            {
              title: 'Key Concepts',
              content:
                'Before implementation, identify the main requirements and risks. Break the system into smaller maintainable pieces and validate each part through testing and review.',
            },
            {
              title: 'Best Practices',
              content:
                'Consistent engineering practices, input validation, proper error handling, useful logging and regular dependency reviews help make applications more reliable and secure.',
            },
            {
              title: 'Conclusion',
              content:
                'A good solution is not simply one that works today. It should also remain maintainable, extensible and secure as the project grows.',
            },
          ],
        },
        fa: {
          title: 'راهنمای جامع امن‌سازی اپلیکیشن Next.js',
          excerpt:
            'یادگیری روش‌های امنیتی ضروری برای Next.js شامل احراز هویت، مجوزدهی، اعتبارسنجی ورودی و محافظت در برابر آسیب‌پذیری‌های رایج وب.',
          intro:
            'در توسعه مدرن نرم‌افزار، فقط ساختن یک قابلیت کافی نیست. معماری، امنیت، قابلیت نگهداری و تجربه توسعه‌دهنده نقش مهمی در کیفیت نهایی محصول دارند.',
          authorRole: 'مهندس امنیت ارشد',
          tags: ['Next.js', 'امنیت', 'احراز هویت', 'OWASP'],
          sections: [
            {
              title: 'مقدمه',
              content:
                'در توسعه مدرن نرم‌افزار، فقط ساختن یک قابلیت کافی نیست. معماری، امنیت، قابلیت نگهداری و تجربه توسعه‌دهنده نقش مهمی در کیفیت نهایی محصول دارند.',
            },
            {
              title: 'نکات مهم',
              content:
                'بهتر است قبل از پیاده‌سازی، نیازمندی‌ها و ریسک‌های اصلی مشخص شوند. سپس ساختار پروژه به بخش‌های کوچک‌تر و قابل نگهداری تقسیم شود.',
            },
            {
              title: 'بهترین روش‌ها',
              content:
                'استفاده از اصول ساده و قابل تکرار، اعتبارسنجی ورودی‌ها، مدیریت صحیح خطاها، logging مناسب و بررسی مداوم وابستگی‌ها باعث می‌شود سیستم پایدارتر باشد.',
            },
            {
              title: 'جمع‌بندی',
              content:
                'یک راه‌حل خوب فقط راه‌حلی نیست که امروز کار کند؛ باید قابل توسعه، قابل نگهداری و تا حد امکان امن باشد.',
            },
          ],
        },
      },
      {
        slug: 'scalable-microservices-nodejs-docker',
        category: BlogCategory.DEVELOPMENT,
        authorName: 'John Doe',
        authorAvatar: null,
        date: '2025-03-10',
        readTime: 15,
        coverImage: '/blog/microservices.jpg',
        statsViews: 2156,
        statsLikes: 278,
        statsComments: 32,
        featured: true,
        published: true,
        order: 1,
        en: {
          title: 'Building Scalable Microservices with Node.js and Docker',
          excerpt:
            'A deep dive into designing and implementing scalable microservices architecture using Node.js, Docker, and Kubernetes.',
          intro:
            'Microservices architecture has become the go-to approach for building scalable cloud-native applications.',
          authorRole: 'Full Stack Developer',
          tags: ['Node.js', 'Docker', 'Microservices', 'Kubernetes'],
          sections: [
            {
              title: 'Introduction to Microservices',
              content:
                'Microservices architecture has become the go-to approach for building scalable cloud-native applications.',
            },
            {
              title: 'Design Principles',
              content:
                'Each service should have a single responsibility and communicate through well-defined APIs.',
            },
            {
              title: 'Containerization with Docker',
              content:
                'Docker provides consistent environments from development to production.',
            },
            {
              title: 'Orchestration with Kubernetes',
              content:
                'Kubernetes handles scaling, load balancing, and service discovery automatically.',
            },
          ],
        },
        fa: {
          title: 'ساخت میکروسرویس‌های مقیاس‌پذیر با Node.js و Docker',
          excerpt:
            'بررسی عمیق طراحی و پیاده‌سازی معماری میکروسرویس مقیاس‌پذیر با Node.js، Docker و Kubernetes.',
          intro:
            'معماری میکروسرویس به رویکرد اصلی برای ساخت اپلیکیشن‌های مقیاس‌پذیر cloud-native تبدیل شده است.',
          authorRole: 'توسعه‌دهنده فول‌استک',
          tags: ['Node.js', 'Docker', 'میکروسرویس', 'Kubernetes'],
          sections: [
            {
              title: 'مقدمه‌ای بر میکروسرویس',
              content:
                'معماری میکروسرویس به رویکرد اصلی برای ساخت اپلیکیشن‌های مقیاس‌پذیر cloud-native تبدیل شده است.',
            },
            {
              title: 'اصول طراحی',
              content:
                'هر سرویس باید یک مسئولیت داشته باشد و از طریق APIهای مشخص ارتباط برقرار کند.',
            },
            {
              title: 'کانتینری‌سازی با Docker',
              content:
                'Docker محیط‌های یکنواخت از توسعه تا production فراهم می‌کند.',
            },
            {
              title: 'ارکستراسیون با Kubernetes',
              content:
                'Kubernetes به‌طور خودکار مقیاس‌پذیری، توزیع بار و کشف سرویس را مدیریت می‌کند.',
            },
          ],
        },
      },
      {
        slug: 'devops-best-practices-2025',
        category: BlogCategory.DEVOPS,
        authorName: 'John Doe',
        authorAvatar: null,
        date: '2025-03-05',
        readTime: 10,
        coverImage: '/blog/devops.jpg',
        statsViews: 1843,
        statsLikes: 215,
        statsComments: 19,
        featured: false,
        published: true,
        order: 2,
        en: {
          title:
            'DevOps Best Practices for 2025: CI/CD, Monitoring, and Security',
          excerpt:
            'Explore the latest DevOps best practices including CI/CD pipelines, infrastructure as code, and monitoring strategies.',
          intro:
            'DevOps practices continue to evolve rapidly, and 2025 brings new priorities.',
          authorRole: 'DevOps Engineer',
          tags: ['DevOps', 'CI/CD', 'Monitoring', 'Security'],
          sections: [
            {
              title: 'CI/CD Pipelines',
              content: 'Automated pipelines are the backbone of modern DevOps.',
            },
            {
              title: 'Infrastructure as Code',
              content:
                'Managing infrastructure through code provides reproducibility and version control.',
            },
            {
              title: 'Monitoring and Observability',
              content:
                'Real-time monitoring is essential for detecting and resolving issues quickly.',
            },
          ],
        },
        fa: {
          title: 'بهترین شیوه‌های DevOps در ۲۰۲۵: CI/CD، مانیتورینگ و امنیت',
          excerpt:
            'بررسی جدیدترین شیوه‌های DevOps شامل خط لوله CI/CD، زیرساخت به‌عنوان کد و استراتژی‌های مانیتورینگ.',
          intro:
            'شیوه‌های DevOps به سرعت در حال تحول هستند و سال ۲۰۲۵ اولویت‌های جدیدی دارد.',
          authorRole: 'مهندس DevOps',
          tags: ['DevOps', 'CI/CD', 'مانیتورینگ', 'امنیت'],
          sections: [
            {
              title: 'خط لوله CI/CD',
              content: 'خط لوله‌های خودکار، ستون فقرات DevOps مدرن هستند.',
            },
            {
              title: 'زیرساخت به‌عنوان کد',
              content:
                'مدیریت زیرساخت از طریق کد، قابلیت بازتولید و کنترل نسخه را فراهم می‌کند.',
            },
            {
              title: 'مانیتورینگ و قابلیت مشاهده',
              content:
                'مانیتورینگ لحظه‌ای برای تشخیص و حل سریع مشکلات ضروری است.',
            },
          ],
        },
      },
      {
        slug: 'developer-to-security-engineer-journey',
        category: BlogCategory.CAREER,
        authorName: 'John Doe',
        authorAvatar: null,
        date: '2025-02-28',
        readTime: 8,
        coverImage: '/blog/career-journey.jpg',
        statsViews: 1532,
        statsLikes: 189,
        statsComments: 45,
        featured: false,
        published: true,
        order: 3,
        en: {
          title: 'From Developer to Security Engineer: My Career Journey',
          excerpt:
            'Sharing my personal journey transitioning from a software developer to a security engineer, including challenges and lessons learned.',
          intro:
            'Two years ago, I was a full-stack developer. Today, I work as a security engineer.',
          authorRole: 'Security Engineer',
          tags: ['Career', 'Security', 'Development', 'Growth'],
          sections: [
            {
              title: 'The Decision',
              content:
                'Two years ago, I was a full-stack developer. Today, I work as a security engineer.',
            },
            {
              title: 'Learning Security',
              content:
                'Security requires a different mindset. Instead of building features, you think about breaking them.',
            },
            {
              title: 'Challenges',
              content:
                'The biggest challenge was learning to think like an attacker.',
            },
          ],
        },
        fa: {
          title: 'از توسعه‌دهنده تا مهندس امنیت: سفر حرفه‌ای من',
          excerpt:
            'اشتراک سفر شخصی من برای گذار از توسعه‌دهنده نرم‌افزار به مهندس امنیت، شامل چالش‌ها و درس‌ها.',
          intro:
            'دو سال پیش یک توسعه‌دهنده فول‌استک بودم. امروز به‌عنوان مهندس امنیت کار می‌کنم.',
          authorRole: 'مهندس امنیت',
          tags: ['حرفه', 'امنیت', 'توسعه', 'رشد'],
          sections: [
            {
              title: 'تصمیم',
              content:
                'دو سال پیش یک توسعه‌دهنده فول‌استک بودم. امروز به‌عنوان مهندس امنیت کار می‌کنم.',
            },
            {
              title: 'یادگیری امنیت',
              content:
                'امنیت نیازمند طرز فکر متفاوتی است. به جای ساختن ویژگی، به شکستن آنها فکر می‌کنی.',
            },
            {
              title: 'چالش‌ها',
              content:
                'بزرگ‌ترین چالش این بود که یاد بگیرم مثل یک مهاجم فکر کنم.',
            },
          ],
        },
      },
      {
        slug: 'contributing-to-open-source-guide',
        category: BlogCategory.OPENSOURCE,
        authorName: 'John Doe',
        authorAvatar: null,
        date: '2025-02-20',
        readTime: 7,
        coverImage: '/blog/opensource.jpg',
        statsViews: 1298,
        statsLikes: 156,
        statsComments: 23,
        featured: false,
        published: true,
        order: 4,
        en: {
          title: "Contributing to Open Source: A Beginner's Guide",
          excerpt:
            'A step-by-step guide to getting started with open-source contributions, from finding the right projects to making your first pull request.',
          intro:
            'Contributing to open source can seem intimidating at first, but it is one of the best ways to grow as a developer.',
          authorRole: 'Open Source Maintainer',
          tags: ['Open Source', 'Git', 'GitHub', 'Community'],
          sections: [
            {
              title: 'Getting Started',
              content:
                'Contributing to open source can seem intimidating at first, but it is one of the best ways to grow as a developer.',
            },
            {
              title: 'Finding Projects',
              content:
                'Look for projects that align with your interests and skill level.',
            },
            {
              title: 'Making Your First PR',
              content:
                'Start small. Documentation fixes and bug reports are great ways to get involved.',
            },
          ],
        },
        fa: {
          title: 'مشارکت در متن‌باز: راهنمای مبتدیان',
          excerpt:
            'راهنمای گام‌به‌گام برای شروع مشارکت در پروژه‌های متن‌باز، از پیدا کردن پروژه مناسب تا اولین pull request.',
          intro:
            'مشارکت در متن‌باز ممکن است در ابتدا دلهره‌آور به نظر برسد، اما یکی از بهترین راه‌های رشد به‌عنوان توسعه‌دهنده است.',
          authorRole: 'نگهدارنده متن‌باز',
          tags: ['متن‌باز', 'Git', 'GitHub', 'جامعه'],
          sections: [
            {
              title: 'شروع کار',
              content:
                'مشارکت در متن‌باز ممکن است در ابتدا دلهره‌آور به نظر برسد، اما یکی از بهترین راه‌های رشد به‌عنوان توسعه‌دهنده است.',
            },
            {
              title: 'پیدا کردن پروژه',
              content:
                'به دنبال پروژه‌هایی باش که با علاقه و سطح مهارتت هماهنگ باشند.',
            },
            {
              title: 'اولین PR',
              content:
                'از کوچک شروع کن. اصلاح مستندات و گزارش باگ راه‌های عالی برای شروع هستند.',
            },
          ],
        },
      },
      {
        slug: 'advanced-typescript-patterns',
        category: BlogCategory.DEVELOPMENT,
        authorName: 'John Doe',
        authorAvatar: null,
        date: '2025-02-15',
        readTime: 11,
        coverImage: '/blog/typescript.jpg',
        statsViews: 964,
        statsLikes: 134,
        statsComments: 18,
        featured: true,
        published: true,
        order: 5,
        en: {
          title: 'Advanced TypeScript Patterns for Large-scale Applications',
          excerpt:
            'Explore advanced TypeScript patterns including generics, type guards, conditional types, and utility types.',
          intro:
            'TypeScript has evolved beyond simple type annotations. Modern patterns can make large codebases more maintainable.',
          authorRole: 'Full Stack Developer',
          tags: ['TypeScript', 'JavaScript', 'Patterns'],
          sections: [
            {
              title: 'Generics',
              content:
                'TypeScript has evolved beyond simple type annotations. Generics let you write reusable, type-safe code.',
            },
            {
              title: 'Type Guards',
              content:
                'Type guards narrow types at runtime, giving you better autocomplete and safety.',
            },
            {
              title: 'Utility Types',
              content:
                'Built-in utility types like Pick, Omit, and Partial save a lot of boilerplate.',
            },
          ],
        },
        fa: {
          title: 'الگوهای پیشرفته TypeScript برای اپلیکیشن‌های بزرگ',
          excerpt:
            'بررسی الگوهای پیشرفته TypeScript شامل generics، type guards، conditional types و utility types.',
          intro:
            'TypeScript از annotation ساده فراتر رفته است. الگوهای مدرن می‌توانند کدهای بزرگ را قابل نگهداری‌تر کنند.',
          authorRole: 'توسعه‌دهنده فول‌استک',
          tags: ['TypeScript', 'JavaScript', 'الگوها'],
          sections: [
            {
              title: 'جنریک‌ها',
              content:
                'TypeScript از annotation ساده فراتر رفته است. جنریک‌ها به شما امکان می‌دهند کد قابل استفاده مجدد بنویسید.',
            },
            {
              title: 'Type Guards',
              content:
                'Type guards نوع‌ها را در runtime محدود می‌کنند و autocomplete و ایمنی بهتری می‌دهند.',
            },
            {
              title: 'Utility Types',
              content:
                'Utility typeهای داخلی مانند Pick، Omit و Partial مقدار زیادی boilerplate را حذف می‌کنند.',
            },
          ],
        },
      },
      {
        slug: 'owasp-top-10-developer-perspective',
        category: BlogCategory.SECURITY,
        authorName: 'John Doe',
        authorAvatar: null,
        date: '2025-02-10',
        readTime: 14,
        coverImage: '/blog/owasp.jpg',
        statsViews: 876,
        statsLikes: 112,
        statsComments: 15,
        featured: false,
        published: true,
        order: 6,
        en: {
          title: "Understanding OWASP Top 10: A Developer's Perspective",
          excerpt:
            'A practical guide to understanding and mitigating the OWASP Top 10 vulnerabilities.',
          intro:
            'The OWASP Top 10 is a standard awareness document for developers and web application security.',
          authorRole: 'Security Engineer',
          tags: ['OWASP', 'Security', 'Vulnerabilities'],
          sections: [
            {
              title: 'Injection Attacks',
              content:
                'The OWASP Top 10 is a standard awareness document. Injection remains one of the most dangerous vulnerabilities.',
            },
            {
              title: 'Broken Authentication',
              content:
                'Weak authentication allows attackers to compromise passwords and session tokens.',
            },
            {
              title: 'Sensitive Data Exposure',
              content: 'Always encrypt sensitive data at rest and in transit.',
            },
          ],
        },
        fa: {
          title: 'درک OWASP Top 10 از دیدگاه توسعه‌دهنده',
          excerpt: 'راهنمای عملی برای درک و کاهش آسیب‌پذیری‌های OWASP Top 10.',
          intro:
            'OWASP Top 10 یک سند آگاهی‌بخش استاندارد برای توسعه‌دهندگان و امنیت اپلیکیشن‌های وب است.',
          authorRole: 'مهندس امنیت',
          tags: ['OWASP', 'امنیت', 'آسیب‌پذیری'],
          sections: [
            {
              title: 'حملات تزریق',
              content:
                'OWASP Top 10 یک سند استاندارد است. تزریق یکی از خطرناک‌ترین آسیب‌پذیری‌ها باقی مانده است.',
            },
            {
              title: 'احراز هویت شکسته',
              content:
                'احراز هویت ضعیف به مهاجمان اجازه می‌دهد رمزها و توکن‌های نشست را به خطر بیندازند.',
            },
            {
              title: 'افشای داده حساس',
              content:
                'همیشه داده‌های حساس را در حالت ذخیره و انتقال رمزنگاری کنید.',
            },
          ],
        },
      },
      {
        slug: 'zero-trust-architecture-implementation',
        category: BlogCategory.SECURITY,
        authorName: 'John Doe',
        authorAvatar: null,
        date: '2025-02-05',
        readTime: 13,
        coverImage: '/blog/zero-trust.jpg',
        statsViews: 745,
        statsLikes: 98,
        statsComments: 12,
        featured: false,
        published: false, // ← draft
        order: 7,
        en: {
          title: 'Implementing Zero Trust Architecture in Modern Applications',
          excerpt:
            'Learn how to implement Zero Trust security architecture in modern applications with practical examples.',
          intro:
            'Zero Trust is a security model that assumes no implicit trust, even inside the network perimeter.',
          authorRole: 'Security Architect',
          tags: ['Zero Trust', 'Security', 'Architecture'],
          sections: [
            {
              title: 'Core Principles',
              content:
                'Zero Trust is a security model that assumes no implicit trust, even inside the network perimeter.',
            },
            {
              title: 'Implementation Steps',
              content:
                'Start by identifying your critical assets and mapping data flows.',
            },
            {
              title: 'Common Pitfalls',
              content:
                'Many teams fail because they try to do everything at once.',
            },
          ],
        },
        fa: {
          title: 'پیاده‌سازی معماری Zero Trust در اپلیکیشن‌های مدرن',
          excerpt:
            'یادگیری نحوه پیاده‌سازی معماری امنیتی Zero Trust در اپلیکیشن‌های مدرن با مثال‌های عملی.',
          intro:
            'Zero Trust یک مدل امنیتی است که هیچ اعتماد ضمنی را نمی‌پذیرد، حتی در داخل مرز شبکه.',
          authorRole: 'معمار امنیت',
          tags: ['Zero Trust', 'امنیت', 'معماری'],
          sections: [
            {
              title: 'اصول اصلی',
              content:
                'Zero Trust یک مدل امنیتی است که هیچ اعتماد ضمنی را نمی‌پذیرد، حتی در داخل مرز شبکه.',
            },
            {
              title: 'مراحل پیاده‌سازی',
              content:
                'با شناسایی دارایی‌های حیاتی و نقشه‌برداری از جریان داده‌ها شروع کن.',
            },
            {
              title: 'اشتباهات رایج',
              content:
                'بسیاری از تیم‌ها شکست می‌خورند چون می‌خواهند همه‌چیز را یکباره انجام دهند.',
            },
          ],
        },
      },
    ];

    for (const pData of data) {
      const post = new BlogPost();
      post.slug = pData.slug;
      post.category = pData.category;
      post.authorName = pData.authorName;
      post.authorAvatar = pData.authorAvatar;
      post.date = pData.date;
      post.readTime = pData.readTime;
      post.coverImage = pData.coverImage;
      post.statsViews = pData.statsViews;
      post.statsLikes = pData.statsLikes;
      post.statsComments = pData.statsComments;
      post.featured = pData.featured;
      post.published = pData.published;
      post.order = pData.order;

      const savedPost = await this.postRepo.save(post);

      // Translations
      const translations: BlogPostTranslation[] = [];

      const enTr = new BlogPostTranslation();
      enTr.language = 'en';
      enTr.title = pData.en.title;
      enTr.excerpt = pData.en.excerpt;
      enTr.intro = pData.en.intro;
      enTr.authorRole = pData.en.authorRole;
      enTr.tags = pData.en.tags;
      enTr.sections = pData.en.sections;
      enTr.postId = savedPost.id;
      translations.push(enTr);

      const faTr = new BlogPostTranslation();
      faTr.language = 'fa';
      faTr.title = pData.fa.title;
      faTr.excerpt = pData.fa.excerpt;
      faTr.intro = pData.fa.intro;
      faTr.authorRole = pData.fa.authorRole;
      faTr.tags = pData.fa.tags;
      faTr.sections = pData.fa.sections;
      faTr.postId = savedPost.id;
      translations.push(faTr);

      const trRepo = this.postRepo.manager.getRepository(BlogPostTranslation);
      await trRepo.save(translations);
    }

    this.logger.log(`✅ Default Blog posts seeded (${data.length} items)`);
  }
}
