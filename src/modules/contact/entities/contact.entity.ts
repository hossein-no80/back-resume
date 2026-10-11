import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContactTranslation } from './contact-translation.entity';

/**
 * Contact - رکورد تکی با id ثابت '1'
 *
 * توجه: فیلدهای email, phone, github, linkedin, location
 * در About هستن و اینجا تکرار نمی‌شن.
 * فرانت از هر دو endpoint (about + contact) داده می‌گیره و merge می‌کنه.
 */
@Entity('contact')
export class Contact {
  @ApiProperty({ example: '1', description: 'شناسه ثابت (همیشه 1)' })
  @PrimaryColumn({ type: 'varchar', length: 10, default: '1' })
  id: string;

  @ApiPropertyOptional({
    example: 'PST (UTC-8)',
    description: 'منطقه زمانی',
  })
  @Column({ type: 'varchar', nullable: true })
  timezone: string | null;

  @ApiPropertyOptional({
    example: '021-12345678',
    description: 'تلفن ثابت',
  })
  @Column({ type: 'varchar', nullable: true })
  landlinePhone: string | null;

  @ApiPropertyOptional({
    example: 'https://instagram.com/username',
    description: 'آدرس اینستاگرام',
  })
  @Column({ type: 'varchar', nullable: true })
  instagramUrl: string | null;

  @ApiPropertyOptional({
    example: 'https://t.me/username',
    description: 'آدرس تلگرام',
  })
  @Column({ type: 'varchar', nullable: true })
  telegramUrl: string | null;

  // ─── Relations ───
  @ApiProperty({ type: () => [ContactTranslation] })
  @OneToMany(() => ContactTranslation, (t) => t.contact, {
    cascade: true,
  })
  translations: ContactTranslation[];

  // ─── Timestamps ───
  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
