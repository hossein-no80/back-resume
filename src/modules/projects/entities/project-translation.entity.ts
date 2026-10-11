import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Project } from './project.entity';

@Entity('project_translations')
@Unique(['projectId', 'language'])
export class ProjectTranslation {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'fa' })
  @Column({ type: 'varchar', length: 5 })
  language: string;

  @ApiProperty({ example: 'سیستم احراز هویت امن' })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({
    example: 'سیستم احراز هویت سازمانی با ویژگی‌های امنیتی پیشرفته',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiPropertyOptional({
    example: 'یک سیستم جامع احراز هویت و مجوزدهی...',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  longDescription: string | null;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['احراز هویت', 'امنیت', 'سازمانی'],
  })
  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['احراز هویت چندعاملی (MFA)', 'ادغام OAuth 2.0'],
  })
  @Column({ type: 'jsonb', default: [] })
  features: string[];

  // ─── Relation ───
  @ManyToOne(() => Project, (p) => p.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;
}
