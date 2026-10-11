import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SkillCategoryTranslation } from './skill-category-translation.entity';
import { SkillItem } from './skill-item.entity';

@Entity('skill_categories')
export class SkillCategory {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'engineering',
    description: 'کلید یکتا برای دسته‌بندی (frontend هم ازش استفاده می‌کنه)',
  })
  @Column({ unique: true, length: 50 })
  key: string;

  @ApiProperty({
    example: 'Code2',
    description: 'نام آیکون Lucide (تو فرانت map می‌شه به کامپوننت)',
  })
  @Column({ length: 50 })
  icon: string;

  @ApiProperty({ example: 0, description: 'ترتیب نمایش' })
  @Column({ type: 'int', default: 0 })
  order: number;

  // ============ Relations ============
  @ApiProperty({ type: () => [SkillCategoryTranslation] })
  @OneToMany(() => SkillCategoryTranslation, (t) => t.category, {
    cascade: true,
  })
  translations: SkillCategoryTranslation[];

  @ApiProperty({ type: () => [SkillItem] })
  @OneToMany(() => SkillItem, (item) => item.category, { cascade: true })
  skills: SkillItem[];

  // ============ Timestamps ============
  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
