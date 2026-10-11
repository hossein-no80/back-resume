import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillItem } from './skill-item.entity';

@Entity('skill_item_translations')
@Unique(['itemId', 'language'])
export class SkillItemTranslation {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'fa', description: 'کد زبان' })
  @Column({ length: 5 })
  language: string;

  @ApiProperty({
    example: 'TypeScript / JavaScript',
    description: 'معمولاً انگلیسی می‌مونه، ولی قابل تغییره',
  })
  @Column({ length: 100 })
  name: string;

  @ApiPropertyOptional({
    example: 'متخصص در توسعه مدرن JS/TS',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  // ============ Relation ============
  @ManyToOne(() => SkillItem, (i) => i.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: SkillItem;

  @ApiProperty({ example: 1 })
  @Column({ name: 'item_id' })
  itemId: number;
}
