import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ─────────────────────────────────────────────
// Stats
// ─────────────────────────────────────────────

export class SkillsStatsResponseDto {
  @ApiProperty({
    example: 5,
    description: 'تعداد سال تجربه (بیشترین years از مهارت‌ها)',
  })
  yearsExperience: number;

  @ApiProperty({
    example: 16,
    description: 'تعداد کل تکنولوژی‌ها (auto)',
  })
  technologies: number;
}

// ─────────────────────────────────────────────
// حالت عمومی (single lang)
// ─────────────────────────────────────────────

export class SkillItemResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  level: number;

  @ApiPropertyOptional({ example: 5, nullable: true })
  years: number | null;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty({ example: 'TypeScript / JavaScript' })
  name: string;

  @ApiPropertyOptional({
    example: 'متخصص در توسعه مدرن JS/TS',
    nullable: true,
  })
  description: string | null;
}

export class SkillCategoryResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'engineering' })
  key: string;

  @ApiProperty({ example: 'Code2' })
  icon: string;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty({ example: 'مهندسی' })
  title: string;

  @ApiProperty({ example: 'مهارت‌های اصلی مهندسی نرم‌افزار' })
  description: string;

  @ApiProperty({ type: [SkillItemResponseDto] })
  skills: SkillItemResponseDto[];
}

export class SkillsResponseDto {
  @ApiProperty({ example: 'fa', description: 'زبان پاسخ' })
  language: string;

  @ApiProperty({ type: SkillsStatsResponseDto })
  stats: SkillsStatsResponseDto;

  @ApiProperty({ type: [SkillCategoryResponseDto] })
  categories: SkillCategoryResponseDto[];
}

// ─────────────────────────────────────────────
// حالت ادمین (multi-lang)
// ─────────────────────────────────────────────

export class SkillCategoryTranslationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'fa' })
  language: string;

  @ApiProperty({ example: 'مهندسی' })
  title: string;

  @ApiProperty({ example: 'مهارت‌های اصلی مهندسی نرم‌افزار' })
  description: string;
}

export class SkillItemTranslationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'fa' })
  language: string;

  @ApiProperty({ example: 'TypeScript / JavaScript' })
  name: string;

  @ApiPropertyOptional({
    example: 'متخصص در توسعه مدرن JS/TS',
    nullable: true,
  })
  description: string | null;
}

export class SkillItemAdminResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  level: number;

  @ApiPropertyOptional({ example: 5, nullable: true })
  years: number | null;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty({ type: [SkillItemTranslationResponseDto] })
  translations: SkillItemTranslationResponseDto[];
}

export class SkillCategoryAdminResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'engineering' })
  key: string;

  @ApiProperty({ example: 'Code2' })
  icon: string;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty({ type: [SkillCategoryTranslationResponseDto] })
  translations: SkillCategoryTranslationResponseDto[];

  @ApiProperty({ type: [SkillItemAdminResponseDto] })
  skills: SkillItemAdminResponseDto[];
}

export class SkillsAdminResponseDto {
  @ApiProperty({ type: SkillsStatsResponseDto })
  stats: SkillsStatsResponseDto;

  @ApiProperty({ type: [SkillCategoryAdminResponseDto] })
  categories: SkillCategoryAdminResponseDto[];
}
