import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExperienceType } from '../enums/experience-type.enum';

// ─────────────────────────────────────────────
// Stats
// ─────────────────────────────────────────────

export class ExperienceStatsResponseDto {
  @ApiProperty({
    example: 5,
    description: 'تعداد سال تجربه (auto: از قدیمی‌ترین startDate محاسبه می‌شه)',
  })
  yearsExperience: number;

  @ApiProperty({
    example: 5,
    description: 'تعداد شرکت‌ها (auto)',
  })
  companies: number;
}

// ─────────────────────────────────────────────
// حالت عمومی (single lang)
// ─────────────────────────────────────────────

export class ExperienceItemResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ example: 'TechCorp Inc.' })
  company: string;

  @ApiPropertyOptional({
    example: '/uploads/techcorp.png',
    nullable: true,
  })
  companyLogo: string | null;

  @ApiProperty({ example: 'توسعه‌دهنده ارشد فول‌استک' })
  position: string;

  @ApiProperty({ example: 'سان‌فرانسیسکو (دورکاری)' })
  location: string;

  @ApiProperty({ example: 'Jan 2024' })
  startDate: string;

  @ApiPropertyOptional({
    example: 'Dec 2023',
    nullable: true,
    description: 'null یعنی «تا کنون»',
  })
  endDate: string | null;

  @ApiProperty({ enum: ExperienceType, example: ExperienceType.FULL_TIME })
  type: ExperienceType;

  @ApiPropertyOptional({ example: 'فین‌تک', nullable: true })
  industry: string | null;

  @ApiPropertyOptional({ example: 'https://techcorp.com', nullable: true })
  website: string | null;

  @ApiProperty({ example: true })
  featured: boolean;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['Next.js', 'TypeScript', 'Node.js'],
  })
  technologies: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['رهبری توسعه...', 'طراحی معماری...'],
  })
  description: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['کاهش ۴۵٪ زمان پاسخ API'],
  })
  achievements: string[];
}

export class ExperienceResponseDto {
  @ApiProperty({ example: 'fa', description: 'زبان پاسخ' })
  language: string;

  @ApiProperty({ type: ExperienceStatsResponseDto })
  stats: ExperienceStatsResponseDto;

  @ApiProperty({ type: [ExperienceItemResponseDto] })
  experiences: ExperienceItemResponseDto[];
}

// ─────────────────────────────────────────────
// حالت ادمین (multi-lang)
// ─────────────────────────────────────────────

export class ExperienceTranslationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'fa' })
  language: string;

  @ApiProperty({ example: 'توسعه‌دهنده ارشد فول‌استک' })
  position: string;

  @ApiProperty({ example: 'سان‌فرانسیسکو (دورکاری)' })
  location: string;

  @ApiPropertyOptional({ example: 'فین‌تک', nullable: true })
  industry: string | null;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
  })
  description: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
  })
  achievements: string[];
}

export class ExperienceAdminResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ example: 'TechCorp Inc.' })
  company: string;

  @ApiPropertyOptional({
    example: '/uploads/techcorp.png',
    nullable: true,
  })
  companyLogo: string | null;

  @ApiProperty({ example: 'Jan 2024' })
  startDate: string;

  @ApiPropertyOptional({ example: 'Dec 2023', nullable: true })
  endDate: string | null;

  @ApiProperty({ enum: ExperienceType })
  type: ExperienceType;

  @ApiPropertyOptional({ example: 'https://techcorp.com', nullable: true })
  website: string | null;

  @ApiProperty({ example: true })
  featured: boolean;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  technologies: string[];

  @ApiProperty({ type: [ExperienceTranslationResponseDto] })
  translations: ExperienceTranslationResponseDto[];
}

export class ExperienceAdminListResponseDto {
  @ApiProperty({ type: ExperienceStatsResponseDto })
  stats: ExperienceStatsResponseDto;

  @ApiProperty({ type: [ExperienceAdminResponseDto] })
  experiences: ExperienceAdminResponseDto[];
}
