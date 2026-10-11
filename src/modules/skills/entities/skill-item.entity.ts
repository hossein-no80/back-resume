import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillCategory } from './skill-category.entity';
import { SkillItemTranslation } from './skill-item-translation.entity';

@Entity('skill_items')
export class SkillItem {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 5,
    description: 'سطح مهارت از ۱ تا ۵',
    minimum: 1,
    maximum: 5,
  })
  @Column({ type: 'int' })
  level: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'سال تجربه (اختیاری)',
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  years: number | null;

  @ApiProperty({ example: 0, description: 'ترتیب نمایش' })
  @Column({ type: 'int', default: 0 })
  order: number;

  // ============ Relation: parent category ============
  @ManyToOne(() => SkillCategory, (c) => c.skills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: SkillCategory;

  @ApiProperty({ example: 1 })
  @Column({ name: 'category_id' })
  categoryId: number;

  // ============ Relations: translations ============
  @ApiProperty({ type: () => [SkillItemTranslation] })
  @OneToMany(() => SkillItemTranslation, (t) => t.item, { cascade: true })
  translations: SkillItemTranslation[];
}
