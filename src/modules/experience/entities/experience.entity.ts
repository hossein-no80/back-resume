import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExperienceTranslation } from './experience-translation.entity';
import { ExperienceType } from '../enums/experience-type.enum';

@Entity('experiences')
export class Experience {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'TechCorp Inc.' })
  @Column({ length: 150 })
  company: string;

  @ApiPropertyOptional({
    example: '/uploads/techcorp.png',
    nullable: true,
  })
  @Column({ type: 'varchar', nullable: true })
  companyLogo: string | null;

  @ApiProperty({
    example: 'Jan 2024',
    description: 'تاریخ شروع (متن آزاد)',
  })
  @Column({ length: 50 })
  startDate: string;

  @ApiPropertyOptional({
    example: 'Dec 2023',
    description: 'تاریخ پایان — null یعنی «تا کنون» (Present)',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  endDate: string | null;

  @ApiProperty({
    enum: ExperienceType,
    example: ExperienceType.FULL_TIME,
  })
  @Column({ type: 'enum', enum: ExperienceType })
  type: ExperienceType;

  @ApiPropertyOptional({
    example: 'https://techcorp.com',
    nullable: true,
  })
  @Column({ type: 'varchar', nullable: true })
  website: string | null;

  @ApiProperty({
    example: true,
    description: 'آیا featured است؟ (نمایش بزرگ‌تر تو فرانت)',
  })
  @Column({ default: false })
  featured: boolean;

  @ApiProperty({ example: 0, description: 'ترتیب نمایش' })
  @Column({ type: 'int', default: 0 })
  order: number;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['Next.js', 'TypeScript', 'Node.js'],
    description: 'اسم تکنولوژی‌ها (بدون ترجمه، مشترک همه زبان‌ها)',
  })
  @Column({ type: 'jsonb', default: [] })
  technologies: string[];

  // ============ Relations ============
  @ApiProperty({ type: () => [ExperienceTranslation] })
  @OneToMany(() => ExperienceTranslation, (t) => t.experience, {
    cascade: true,
  })
  translations: ExperienceTranslation[];

  // ============ Timestamps ============
  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
