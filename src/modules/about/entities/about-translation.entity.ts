import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { About } from './about.entity';

export interface AboutSectionData {
  id: string;
  icon: string;
  order: number;
  title: string;
  content: string;
}

export interface AboutExpertiseData {
  id: string;
  icon: string;
  order: number;
  title: string;
  description: string;
}

@Entity('about_translations')
@Unique(['aboutId', 'language'])
export class AboutTranslation {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'fa', description: 'کد زبان (fa, en, fr, ...)' })
  @Column({ length: 5 })
  language: string;

  // ============ متن‌های اصلی ============
  @ApiProperty({ example: 'حسین رضایی' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ example: 'مهندس نرم‌افزار · امنیت' })
  @Column({ length: 200 })
  title: string;

  @ApiPropertyOptional({
    example: 'Engineering systems. Understanding how they work.',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  heading: string | null;

  @ApiProperty({ example: 'من یک مهندس نرم‌افزار هستم...' })
  @Column({ type: 'text' })
  bio: string;

  @ApiPropertyOptional({ example: 'تهران، ایران', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  location: string | null;

  // ============ Sections به صورت jsonb ============
  @ApiProperty({ type: 'array' })
  @Column({ type: 'jsonb', default: [] })
  aboutSections: AboutSectionData[];

  // ============ Expertise به صورت jsonb ============
  @ApiProperty({ type: 'array' })
  @Column({ type: 'jsonb', default: [] })
  expertise: AboutExpertiseData[];

  // ============ Relation ============
  @ManyToOne(() => About, (about) => about.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'about_id' })
  about: About;

  @ApiProperty({ example: 1 })
  @Column({ name: 'about_id' })
  aboutId: number;
}
