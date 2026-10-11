import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlogCategory } from '../enums/blog-category.enum';

// ─────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────

export class BlogSectionResponseDto {
  @ApiProperty({ example: 'مقدمه' })
  title: string;

  @ApiProperty({ example: 'در توسعه مدرن...' })
  content: string;
}

// ─────────────────────────────────────────────
// Stats (auto)
// ─────────────────────────────────────────────

export class BlogStatsResponseDto {
  @ApiProperty({
    example: 7,
    description: 'تعداد کل پست‌ها (فقط published در حالت عمومی)',
  })
  total: number;

  @ApiProperty({ example: 3, description: 'تعداد featured' })
  featured: number;

  @ApiProperty({
    example: {
      security: 3,
      development: 2,
      devops: 1,
      career: 1,
      opensource: 1,
    },
    description: 'تعداد به تفکیک دسته',
  })
  byCategory: Record<string, number>;
}

// ─────────────────────────────────────────────
// حالت عمومی (single lang)
// ─────────────────────────────────────────────

export class BlogPostItemResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ example: 'securing-nextjs-application-guide' })
  slug: string;

  @ApiProperty({ example: 'راهنمای امن‌سازی Next.js' })
  title: string;

  @ApiProperty({ example: 'یادگیری روش‌های امنیتی...' })
  excerpt: string;

  @ApiPropertyOptional({ nullable: true })
  intro: string | null;

  @ApiProperty({ enum: BlogCategory, example: BlogCategory.SECURITY })
  category: BlogCategory;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  tags: string[];

  @ApiProperty({
    type: 'object',
    properties: {
      name: { type: 'string' },
      avatar: { type: 'string', nullable: true },
      role: { type: 'string', nullable: true },
    },
    example: {
      name: 'John Doe',
      avatar: null,
      role: 'مهندس امنیت ارشد',
    },
  })
  author: {
    name: string;
    avatar: string | null;
    role: string | null;
  };

  @ApiProperty({ example: '2025-03-15' })
  date: string;

  @ApiProperty({ example: 12 })
  readTime: number;

  @ApiPropertyOptional({ nullable: true })
  coverImage: string | null;

  @ApiProperty({
    type: 'object',
    properties: {
      views: { type: 'number' },
      likes: { type: 'number' },
      comments: { type: 'number' },
    },
    example: { views: 2847, likes: 342, comments: 28 },
  })
  stats: {
    views: number;
    likes: number;
    comments: number;
  };

  @ApiProperty({ type: [BlogSectionResponseDto] })
  sections: BlogSectionResponseDto[];

  @ApiProperty({ example: true })
  featured: boolean;

  @ApiProperty({ example: 0 })
  order: number;
}

export class BlogResponseDto {
  @ApiProperty({ example: 'fa' })
  language: string;

  @ApiProperty({ type: BlogStatsResponseDto })
  stats: BlogStatsResponseDto;

  @ApiProperty({ type: [BlogPostItemResponseDto] })
  posts: BlogPostItemResponseDto[];
}

// ─────────────────────────────────────────────
// حالت ادمین (multi-lang)
// ─────────────────────────────────────────────

export class BlogTranslationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'fa' })
  language: string;

  @ApiProperty({ example: 'راهنمای امن‌سازی...' })
  title: string;

  @ApiProperty({ example: 'یادگیری...' })
  excerpt: string;

  @ApiPropertyOptional({ nullable: true })
  intro: string | null;

  @ApiPropertyOptional({ nullable: true })
  authorRole: string | null;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  tags: string[];

  @ApiProperty({ type: [BlogSectionResponseDto] })
  sections: BlogSectionResponseDto[];
}

export class BlogPostAdminResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ example: 'securing-nextjs-application-guide' })
  slug: string;

  @ApiProperty({ enum: BlogCategory })
  category: BlogCategory;

  @ApiProperty({ example: 'John Doe' })
  authorName: string;

  @ApiPropertyOptional({ nullable: true })
  authorAvatar: string | null;

  @ApiProperty({ example: '2025-03-15' })
  date: string;

  @ApiProperty({ example: 12 })
  readTime: number;

  @ApiPropertyOptional({ nullable: true })
  coverImage: string | null;

  @ApiProperty({ example: 2847 })
  statsViews: number;

  @ApiProperty({ example: 342 })
  statsLikes: number;

  @ApiProperty({ example: 28 })
  statsComments: number;

  @ApiProperty({ example: true })
  featured: boolean;

  @ApiProperty({ example: true })
  published: boolean;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty({ type: [BlogTranslationResponseDto] })
  translations: BlogTranslationResponseDto[];
}

export class BlogAdminListResponseDto {
  @ApiProperty({ type: BlogStatsResponseDto })
  stats: BlogStatsResponseDto;

  @ApiProperty({ type: [BlogPostAdminResponseDto] })
  posts: BlogPostAdminResponseDto[];
}
