import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Contact } from './contact.entity';

/**
 * یک بازه‌ی کاری (روز + ساعت)
 */
export interface WorkingHour {
  day: string; // "دوشنبه تا جمعه"
  hours: string; // "۹:۰۰ تا ۱۸:۰۰" یا "تعطیل"
}

@Entity('contact_translations')
@Unique(['contactId', 'language'])
export class ContactTranslation {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'fa', description: 'کد زبان' })
  @Column({ type: 'varchar', length: 5 })
  language: string;

  @ApiPropertyOptional({
    example: 'تهران، خیابان آزادی، پلاک ۱۲',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  address: string | null;

  @ApiProperty({
    type: 'array',
    example: [
      { day: 'دوشنبه تا جمعه', hours: '۹:۰۰ تا ۱۸:۰۰' },
      { day: 'شنبه', hours: '۱۰:۰۰ تا ۱۶:۰۰' },
      { day: 'یکشنبه', hours: 'تعطیل' },
    ],
    description: 'ساعات کاری',
  })
  @Column({ type: 'jsonb', default: [] })
  workingHours: WorkingHour[];

  // ─── Relation ───
  @ManyToOne(() => Contact, (c) => c.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

  @ApiProperty({ example: '1' })
  @Column({ name: 'contact_id', type: 'varchar', length: 10 })
  contactId: string;
}
