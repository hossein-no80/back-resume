import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { BlogPostTranslation } from './entities/blog-post-translation.entity';
import { UpdateBlogDto } from './dto/upsert-blog.dto';
import { BlogPostDto } from './dto/blog-post.dto';
import { BlogCategory } from './enums/blog-category.enum';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../../common/constants';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface BlogSection {
  title: string;
  content: string;
}

export interface BlogStats {
  total: number;
  featured: number;
  byCategory: Record<string, number>;
}

export interface BlogPostItemResponse {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  intro: string | null;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string | null;
    role: string | null;
  };
  date: string;
  readTime: number;
  coverImage: string | null;
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  sections: BlogSection[];
  featured: boolean;
  order: number;
}

export interface BlogResponse {
  language: string;
  stats: BlogStats;
  posts: BlogPostItemResponse[];
}

export interface BlogAdminResponse {
  stats: BlogStats;
  posts: {
    id: string;
    slug: string;
    category: string;
    authorName: string;
    authorAvatar: string | null;
    date: string;
    readTime: number;
    coverImage: string | null;
    statsViews: number;
    statsLikes: number;
    statsComments: number;
    featured: boolean;
    published: boolean;
    order: number;
    translations: {
      id: number;
      language: string;
      title: string;
      excerpt: string;
      intro: string | null;
      authorRole: string | null;
      tags: string[];
      sections: BlogSection[];
    }[];
  }[];
}

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    @InjectRepository(BlogPost)
    private readonly postRepo: Repository<BlogPost>,
    private readonly dataSource: DataSource,
  ) {}

  // ─────────────────────────────────────────────
  // GET /blog?lang=fa  (عمومی — فقط published)
  // ─────────────────────────────────────────────
  async getByLanguage(lang: string = DEFAULT_LANGUAGE): Promise<BlogResponse> {
    const posts = await this.postRepo.find({
      where: { published: true },
      relations: ['translations'],
      order: { order: 'ASC' },
    });

    if (posts.length === 0) {
      throw new NotFoundException(
        'Blog posts not found. Please create them via PATCH /blog',
      );
    }

    return {
      language: lang,
      stats: this.calculateStats(posts),
      posts: posts.map((p) => this.formatItem(p, lang)),
    };
  }

  // ─────────────────────────────────────────────
  // GET /blog/:slug?lang=fa  (عمومی — جزئیات)
  // ─────────────────────────────────────────────
  async getBySlug(
    slug: string,
    lang: string = DEFAULT_LANGUAGE,
  ): Promise<BlogPostItemResponse> {
    const post = await this.postRepo.findOne({
      where: { slug, published: true },
      relations: ['translations'],
    });

    if (!post) {
      throw new NotFoundException(`Blog post "${slug}" not found`);
    }

    return this.formatItem(post, lang);
  }

  // ─────────────────────────────────────────────
  // GET /blog/admin  (ادمین — همه)
  // ─────────────────────────────────────────────
  async getAll(): Promise<BlogAdminResponse> {
    const posts = await this.postRepo.find({
      relations: ['translations'],
      order: { order: 'ASC' },
    });

    if (posts.length === 0) {
      throw new NotFoundException(
        'Blog posts not found. Please create them via PATCH /blog',
      );
    }

    return {
      stats: this.calculateStats(posts),
      posts: posts.map((p) => ({
        id: p.id,
        slug: p.slug,
        category: p.category,
        authorName: p.authorName,
        authorAvatar: p.authorAvatar,
        date: p.date,
        readTime: p.readTime,
        coverImage: p.coverImage,
        statsViews: p.statsViews,
        statsLikes: p.statsLikes,
        statsComments: p.statsComments,
        featured: p.featured,
        published: p.published,
        order: p.order,
        translations: (p.translations ?? []).map((t) => ({
          id: t.id,
          language: t.language,
          title: t.title,
          excerpt: t.excerpt,
          intro: t.intro,
          authorRole: t.authorRole,
          tags: t.tags ?? [],
          sections: (t.sections ?? []) as BlogSection[],
        })),
      })),
    };
  }

  // ─────────────────────────────────────────────
  // PATCH /blog  (ادمین — replace کامل)
  // ─────────────────────────────────────────────
  async patch(dto: UpdateBlogDto): Promise<BlogAdminResponse> {
    if (!dto.posts) {
      return this.getAll();
    }

    this.validateInput(dto.posts);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ─── پاک کردن همه پست‌های قبلی ───
      const existing = await queryRunner.manager.find(BlogPost, {
        select: ['id'],
      });

      for (const p of existing) {
        await queryRunner.manager.delete(BlogPost, { id: p.id });
      }

      // ─── درج ساختار جدید ───
      for (const pDto of dto.posts) {
        const post = new BlogPost();
        post.slug = pDto.slug;
        post.category = pDto.category;
        post.authorName = pDto.authorName;
        post.authorAvatar = pDto.authorAvatar ?? null;
        post.date = pDto.date;
        post.readTime = pDto.readTime;
        post.coverImage = pDto.coverImage ?? null;
        post.statsViews = pDto.statsViews ?? 0;
        post.statsLikes = pDto.statsLikes ?? 0;
        post.statsComments = pDto.statsComments ?? 0;
        post.featured = pDto.featured;
        post.published = pDto.published;
        post.order = pDto.order;

        const savedPost = await queryRunner.manager.save(post);

        // Translations
        const translations = pDto.translations.map((t) => {
          const tr = new BlogPostTranslation();
          tr.language = t.language;
          tr.title = t.title;
          tr.excerpt = t.excerpt;
          tr.intro = t.intro ?? null;
          tr.authorRole = t.authorRole ?? null;
          tr.tags = t.tags ?? [];
          tr.sections = (t.sections ?? []) as BlogSection[];
          tr.postId = savedPost.id;
          return tr;
        });

        await queryRunner.manager.save(translations);
      }

      await queryRunner.commitTransaction();
      this.logger.log('Blog patched successfully');

      return await this.getAll();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const err = error as Error;
      this.logger.error(`Error in Blog patch: ${err.message}`, err.stack);
      throw new InternalServerErrorException(
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Error saving Blog',
      );
    } finally {
      await queryRunner.release();
    }
  }

  // ─────────────────────────────────────────────
  // POST /blog/:slug/view  (عمومی — افزایش بازدید)
  // ─────────────────────────────────────────────
  async incrementViews(slug: string): Promise<{ views: number }> {
    const post = await this.postRepo.findOne({ where: { slug } });
    if (!post) {
      throw new NotFoundException(`Blog post "${slug}" not found`);
    }

    post.statsViews += 1;
    await this.postRepo.save(post);

    return { views: post.statsViews };
  }

  // ─────────────────────────────────────────────
  // DELETE /blog  (ادمین)
  // ─────────────────────────────────────────────
  async remove(): Promise<{ message: string }> {
    const count = await this.postRepo.count();
    if (count === 0) {
      throw new NotFoundException('Blog posts not found');
    }

    const existing = await this.postRepo.find({ select: ['id'] });
    for (const p of existing) {
      await this.postRepo.delete({ id: p.id });
    }

    return { message: 'Blog deleted successfully' };
  }

  // ─────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────

  /**
   * محاسبه خودکار آمار:
   * - total, featured, byCategory
   */
  private calculateStats(posts: BlogPost[]): BlogStats {
    const total = posts.length;
    const featured = posts.filter((p) => p.featured).length;

    const byCategory: Record<string, number> = {};
    Object.values(BlogCategory).forEach((cat) => {
      byCategory[cat] = 0;
    });
    for (const p of posts) {
      byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
    }

    return { total, featured, byCategory };
  }

  private formatItem(p: BlogPost, lang: string): BlogPostItemResponse {
    const translations = p.translations ?? [];

    const t =
      translations.find((x) => x.language === lang) ??
      translations.find((x) => x.language === 'en') ??
      translations.find((x) => x.language === 'fa') ??
      translations[0];

    if (!t) {
      throw new NotFoundException(
        `No translation available for blog post "${p.slug}"`,
      );
    }

    return {
      id: p.id,
      slug: p.slug,
      title: t.title,
      excerpt: t.excerpt,
      intro: t.intro,
      category: p.category,
      tags: t.tags ?? [],
      author: {
        name: p.authorName,
        avatar: p.authorAvatar,
        role: t.authorRole,
      },
      date: p.date,
      readTime: p.readTime,
      coverImage: p.coverImage,
      stats: {
        views: p.statsViews,
        likes: p.statsLikes,
        comments: p.statsComments,
      },
      sections: (t.sections ?? []) as BlogSection[],
      featured: p.featured,
      order: p.order,
    };
  }

  private validateInput(posts: BlogPostDto[]): void {
    const slugs = new Set<string>();
    for (const p of posts) {
      // چک تکراری نبودن slug
      if (slugs.has(p.slug)) {
        throw new BadRequestException(`Duplicate slug "${p.slug}"`);
      }
      slugs.add(p.slug);

      // چک زبان‌ها
      this.validateLanguages(
        p.translations.map((t) => t.language),
        `post "${p.slug}"`,
      );
    }
  }

  private validateLanguages(languages: string[], context: string): void {
    const seen = new Set<string>();
    for (const lang of languages) {
      if (!SUPPORTED_LANGUAGES.includes(lang as never)) {
        throw new BadRequestException(
          `Language "${lang}" is not supported (in ${context})`,
        );
      }
      if (seen.has(lang)) {
        throw new BadRequestException(
          `Duplicate language "${lang}" in ${context}`,
        );
      }
      seen.add(lang);
    }
  }
}
