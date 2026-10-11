import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SkillCategory } from './skill-category.entity';

@Entity('skill_category_translations')
@Unique(['categoryId', 'language'])
export class SkillCategoryTranslation {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'fa', description: 'کد زبان (fa, en, fr, ...)' })
  @Column({ length: 5 })
  language: string;

  @ApiProperty({ example: 'مهندسی' })
  @Column({ length: 100 })
  title: string;

  @ApiProperty({ example: 'مهارت‌های اصلی مهندسی نرم‌افزار' })
  @Column({ type: 'text' })
  description: string;

  // ============ Relation ============
  @ManyToOne(() => SkillCategory, (c) => c.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: SkillCategory;

  @ApiProperty({ example: 1 })
  @Column({ name: 'category_id' })
  categoryId: number;
}
