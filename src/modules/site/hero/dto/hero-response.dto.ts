import { ApiProperty } from '@nestjs/swagger';

// ─────────────────────────────────────────────
// Single language
// ─────────────────────────────────────────────

export class HeroResponseDto {
  @ApiProperty({ example: 'fa' })
  language: string;

  @ApiProperty({ example: 'ساخت نرم‌افزارهای قابل اعتماد.' })
  title: string;

  @ApiProperty({ example: 'تفکر مانند یک مهاجم.' })
  subtitle: string;

  @ApiProperty({
    example:
      'من برنامه‌های وب مدرن طراحی و می‌سازم و همزمان در حوزه امنیت سایبری فعالیت می‌کنم.',
  })
  description: string;

  @ApiProperty({ example: 'مشاهده کارهای من' })
  cta1: string;

  @ApiProperty({ example: 'مهارت‌ها را ببینید' })
  cta2: string;

  @ApiProperty({ example: 'آماده همکاری برای پروژه‌های جدید' })
  status: string;

  @ApiProperty({ example: 'مهندس نرم‌افزار · امنیت' })
  role: string;
}

// ─────────────────────────────────────────────
// Admin (multi-lang)
// ─────────────────────────────────────────────

export class HeroTranslationResponseDto extends HeroResponseDto {
  @ApiProperty({ example: 1 })
  id: number;
}

export class HeroFullResponseDto {
  @ApiProperty({ type: [HeroTranslationResponseDto] })
  translations: HeroTranslationResponseDto[];
}
