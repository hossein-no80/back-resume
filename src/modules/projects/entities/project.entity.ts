import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectTranslation } from './project-translation.entity';
import { ProjectCategory, ProjectStatus } from '../enums/project.enums';

@Entity('projects')
export class Project {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    enum: ProjectCategory,
    example: ProjectCategory.SECURITY,
  })
  @Column({ type: 'enum', enum: ProjectCategory })
  category: ProjectCategory;

  @ApiPropertyOptional({
    example: '/uploads/project-cover.jpg',
    nullable: true,
  })
  @Column({ type: 'varchar', nullable: true })
  image: string | null;

  @ApiPropertyOptional({
    example: 'https://github.com/yourusername/secureauth-pro',
    nullable: true,
  })
  @Column({ type: 'varchar', nullable: true })
  githubUrl: string | null;

  @ApiPropertyOptional({
    example: 'https://secureauth-pro.com',
    nullable: true,
  })
  @Column({ type: 'varchar', nullable: true })
  liveUrl: string | null;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['Next.js', 'TypeScript', 'Node.js'],
    description: 'تکنولوژی‌ها (بدون ترجمه)',
  })
  @Column({ type: 'jsonb', default: [] })
  techStack: string[];

  @ApiProperty({
    example: '2025',
    description: 'تاریخ پروژه (متن آزاد)',
  })
  @Column({ type: 'varchar', length: 50 })
  date: string;

  @ApiProperty({
    enum: ProjectStatus,
    example: ProjectStatus.ACTIVE,
  })
  @Column({ type: 'enum', enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty({ example: true })
  @Column({ default: false })
  featured: boolean;

  @ApiProperty({ example: 0 })
  @Column({ type: 'int', default: 0 })
  order: number;

  // ─── Stats (nullable) ───
  @ApiPropertyOptional({ example: 128, nullable: true })
  @Column({ type: 'int', nullable: true })
  statsStars: number | null;

  @ApiPropertyOptional({ example: 34, nullable: true })
  @Column({ type: 'int', nullable: true })
  statsForks: number | null;

  @ApiPropertyOptional({ example: 4200, nullable: true })
  @Column({ type: 'int', nullable: true })
  statsViews: number | null;

  @ApiPropertyOptional({ example: 50000, nullable: true })
  @Column({ type: 'int', nullable: true })
  statsUsers: number | null;

  // ─── Relations ───
  @ApiProperty({ type: () => [ProjectTranslation] })
  @OneToMany(() => ProjectTranslation, (t) => t.project, {
    cascade: true,
  })
  translations: ProjectTranslation[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
