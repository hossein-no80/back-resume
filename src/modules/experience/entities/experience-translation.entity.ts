import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Experience } from './experience.entity';

@Entity('experience_translations')
@Unique(['experienceId', 'language'])
export class ExperienceTranslation {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'fa', description: 'کد زبان' })
  @Column({ type: 'varchar', length: 5 })
  language: string;

  @ApiProperty({ example: 'توسعه‌دهنده ارشد فول‌استک' })
  @Column({ type: 'varchar', length: 150 })
  position: string;

  @ApiProperty({ example: 'سان‌فرانسیسکو (دورکاری)' })
  @Column({ type: 'varchar', length: 150 })
  location: string;

  @ApiPropertyOptional({ example: 'فین‌تک', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  industry: string | null;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['رهبری توسعه پلتفرم معاملاتی...', 'طراحی معماری میکروسرویس...'],
    description: 'آرایه‌ای از پاراگراف‌های توضیح',
  })
  @Column({ type: 'jsonb', default: [] })
  description: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['کاهش ۴۵٪ زمان پاسخ API', 'مهاجرت monolith به microservice'],
    description: 'آرایه‌ای از دستاوردها (bullets)',
  })
  @Column({ type: 'jsonb', default: [] })
  achievements: string[];

  // ============ Relation ============
  @ManyToOne(() => Experience, (e) => e.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'experience_id' })
  experience: Experience;

  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @Column({ name: 'experience_id', type: 'uuid' })
  experienceId: string;
}
