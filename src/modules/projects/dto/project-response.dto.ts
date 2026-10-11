import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectCategory, ProjectStatus } from '../enums/project.enums';

// ─────────────────────────────────────────────
// Stats (auto)
// ─────────────────────────────────────────────

export class ProjectStatsResponseDto {
  @ApiProperty({
    example: 6,
    description: 'تعداد کل پروژه‌ها (auto)',
  })
  total: number;

  @ApiProperty({
    example: 4,
    description: 'تعداد پروژه‌های featured (auto)',
  })
  featured: number;

  @ApiProperty({
    example: {
      web: 1,
      mobile: 1,
      security: 2,
      fullstack: 1,
      opensource: 1,
    },
    description: 'تعداد پروژه‌ها به تفکیک دسته (auto)',
  })
  byCategory: Record<ProjectCategory, number>;
}

// ─────────────────────────────────────────────
// حالت عمومی (single lang)
// ─────────────────────────────────────────────

export class ProjectItemResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ example: 'سیستم احراز هویت امن' })
  title: string;

  @ApiProperty({
    example: 'سیستم احراز هویت سازمانی با ویژگی‌های امنیتی پیشرفته',
  })
  description: string;

  @ApiPropertyOptional({
    example: 'یک سیستم جامع احراز هویت و مجوزدهی...',
    nullable: true,
  })
  longDescription: string | null;

  @ApiProperty({ enum: ProjectCategory, example: ProjectCategory.SECURITY })
  category: ProjectCategory;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['احراز هویت', 'امنیت', 'سازمانی'],
  })
  tags: string[];

  @ApiPropertyOptional({
    example: '/uploads/project-cover.jpg',
    nullable: true,
  })
  image: string | null;

  @ApiPropertyOptional({
    example: 'https://github.com/yourusername/secureauth-pro',
    nullable: true,
  })
  githubUrl: string | null;

  @ApiPropertyOptional({
    example: 'https://secureauth-pro.com',
    nullable: true,
  })
  liveUrl: string | null;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['Next.js', 'TypeScript', 'Node.js'],
  })
  techStack: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['احراز هویت چندعاملی (MFA)', 'ادغام OAuth 2.0'],
  })
  features: string[];

  @ApiProperty({ example: '2025' })
  date: string;

  @ApiProperty({
    type: 'object',
    properties: {
      stars: { type: 'number', nullable: true },
      forks: { type: 'number', nullable: true },
      views: { type: 'number', nullable: true },
      users: { type: 'number', nullable: true },
    },
    example: { stars: 128, forks: 34, views: 4200, users: null },
    description: 'آمار پروژه (اگه هیچ‌کدوم مقدار نداشته باشن، null برمی‌گرده)',
    nullable: true,
  })
  stats: {
    stars: number | null;
    forks: number | null;
    views: number | null;
    users: number | null;
  } | null;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.ACTIVE })
  status: ProjectStatus;

  @ApiProperty({ example: true })
  featured: boolean;

  @ApiProperty({ example: 0 })
  order: number;
}

export class ProjectResponseDto {
  @ApiProperty({ example: 'fa' })
  language: string;

  @ApiProperty({ type: ProjectStatsResponseDto })
  stats: ProjectStatsResponseDto;

  @ApiProperty({ type: [ProjectItemResponseDto] })
  projects: ProjectItemResponseDto[];
}

// ─────────────────────────────────────────────
// حالت ادمین (multi-lang)
// ─────────────────────────────────────────────

export class ProjectTranslationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'fa' })
  language: string;

  @ApiProperty({ example: 'سیستم احراز هویت امن' })
  title: string;

  @ApiProperty({ example: 'سیستم احراز هویت سازمانی...' })
  description: string;

  @ApiPropertyOptional({ nullable: true })
  longDescription: string | null;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  tags: string[];

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  features: string[];
}

export class ProjectAdminResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ enum: ProjectCategory })
  category: ProjectCategory;

  @ApiPropertyOptional({ nullable: true })
  image: string | null;

  @ApiPropertyOptional({ nullable: true })
  githubUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  liveUrl: string | null;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  techStack: string[];

  @ApiProperty({ example: '2025' })
  date: string;

  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty({ example: true })
  featured: boolean;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiPropertyOptional({ example: 128, nullable: true })
  statsStars: number | null;

  @ApiPropertyOptional({ example: 34, nullable: true })
  statsForks: number | null;

  @ApiPropertyOptional({ example: 4200, nullable: true })
  statsViews: number | null;

  @ApiPropertyOptional({ example: 50000, nullable: true })
  statsUsers: number | null;

  @ApiProperty({ type: [ProjectTranslationResponseDto] })
  translations: ProjectTranslationResponseDto[];
}

export class ProjectAdminListResponseDto {
  @ApiProperty({ type: ProjectStatsResponseDto })
  stats: ProjectStatsResponseDto;

  @ApiProperty({ type: [ProjectAdminResponseDto] })
  projects: ProjectAdminResponseDto[];
}
