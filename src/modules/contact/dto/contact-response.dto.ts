import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ─────────────────────────────────────────────
// Working Hour Response
// ─────────────────────────────────────────────

export class WorkingHourResponseDto {
  @ApiProperty({ example: 'دوشنبه تا جمعه' })
  day: string;

  @ApiProperty({ example: '۹:۰۰ تا ۱۸:۰۰' })
  hours: string;
}

// ─────────────────────────────────────────────
// حالت عمومی (single lang)
// ─────────────────────────────────────────────

export class ContactResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiPropertyOptional({ example: 'PST (UTC-8)', nullable: true })
  timezone: string | null;

  @ApiPropertyOptional({ example: '021-12345678', nullable: true })
  landlinePhone: string | null;

  @ApiPropertyOptional({
    example: 'https://instagram.com/username',
    nullable: true,
  })
  instagramUrl: string | null;

  @ApiPropertyOptional({
    example: 'https://t.me/username',
    nullable: true,
  })
  telegramUrl: string | null;

  @ApiPropertyOptional({
    example: 'تهران، خیابان آزادی، پلاک ۱۲',
    nullable: true,
  })
  address: string | null;

  @ApiProperty({
    type: [WorkingHourResponseDto],
    example: [
      { day: 'دوشنبه تا جمعه', hours: '۹:۰۰ تا ۱۸:۰۰' },
      { day: 'شنبه', hours: '۱۰:۰۰ تا ۱۶:۰۰' },
      { day: 'یکشنبه', hours: 'تعطیل' },
    ],
  })
  workingHours: WorkingHourResponseDto[];

  @ApiProperty({ example: 'fa', description: 'زبان پاسخ' })
  language: string;

  @ApiProperty({ example: '2026-10-11T20:29:34.062Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-11T20:29:34.062Z' })
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// حالت ادمین (multi-lang)
// ─────────────────────────────────────────────

export class ContactTranslationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'fa' })
  language: string;

  @ApiPropertyOptional({ nullable: true })
  address: string | null;

  @ApiProperty({ type: [WorkingHourResponseDto] })
  workingHours: WorkingHourResponseDto[];
}

export class ContactAdminResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiPropertyOptional({ nullable: true })
  timezone: string | null;

  @ApiPropertyOptional({ nullable: true })
  landlinePhone: string | null;

  @ApiPropertyOptional({ nullable: true })
  instagramUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  telegramUrl: string | null;

  @ApiProperty({ type: [ContactTranslationResponseDto] })
  translations: ContactTranslationResponseDto[];

  @ApiProperty({ example: '2026-10-11T20:29:34.062Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-11T20:29:34.062Z' })
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// Message (EmailMessage)
// ─────────────────────────────────────────────

export class EmailMessageResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ example: 'علی رضایی' })
  senderName: string;

  @ApiProperty({ example: 'alirezaee@example.com' })
  senderEmail: string;

  @ApiProperty({ example: 'درخواست همکاری' })
  subject: string;

  @ApiProperty({ example: 'متن پیام...' })
  body: string;

  @ApiPropertyOptional({ nullable: true })
  attachmentUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  senderIp: string | null;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ example: '2026-10-11T20:29:34.062Z' })
  receivedAt: Date;
}
