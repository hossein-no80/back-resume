import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlogPostTranslation } from './blog-post-translation.entity';
import { BlogCategory } from '../enums/blog-category.enum';

@Entity('blog_posts')
export class BlogPost {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'securing-nextjs-application-guide',
    description: 'کلید یکتا برای URL',
  })
  @Column({ type: 'varchar', length: 200, unique: true })
  slug: string;

  @ApiProperty({
    enum: BlogCategory,
    example: BlogCategory.SECURITY,
  })
  @Column({ type: 'enum', enum: BlogCategory })
  category: BlogCategory;

  @ApiProperty({
    example: 'John Doe',
    description: 'اسم نویسنده (لاتین، ترجمه نمی‌شه)',
  })
  @Column({ type: 'varchar', length: 100 })
  authorName: string;

  @ApiPropertyOptional({
    example: '/uploads/authors/john.png',
    nullable: true,
  })
  @Column({ type: 'varchar', nullable: true })
  authorAvatar: string | null;

  @ApiProperty({
    example: '2025-03-15',
    description: 'تاریخ انتشار (متن آزاد)',
  })
  @Column({ type: 'varchar', length: 50 })
  date: string;

  @ApiProperty({
    example: 12,
    description: 'زمان مطالعه (دقیقه)',
  })
  @Column({ type: 'int', default: 5 })
  readTime: number;

  @ApiPropertyOptional({
    example: '/blog/security-nextjs.jpg',
    nullable: true,
  })
  @Column({ type: 'varchar', nullable: true })
  coverImage: string | null;

  // ─── Stats (auto + admin قابل ویرایش) ───
  @ApiProperty({ example: 2847, description: 'تعداد بازدید' })
  @Column({ type: 'int', default: 0 })
  statsViews: number;

  @ApiProperty({ example: 342, description: 'تعداد لایک' })
  @Column({ type: 'int', default: 0 })
  statsLikes: number;

  @ApiProperty({ example: 28, description: 'تعداد کامنت' })
  @Column({ type: 'int', default: 0 })
  statsComments: number;

  @ApiProperty({ example: true, description: 'نمایش ویژه' })
  @Column({ default: false })
  featured: boolean;

  @ApiProperty({ example: true, description: 'منتشر شده یا پیش‌نویس' })
  @Column({ default: false })
  published: boolean;

  @ApiProperty({ example: 0, description: 'ترتیب نمایش' })
  @Column({ type: 'int', default: 0 })
  order: number;

  // ─── Relations ───
  @ApiProperty({ type: () => [BlogPostTranslation] })
  @OneToMany(() => BlogPostTranslation, (t) => t.post, {
    cascade: true,
  })
  translations: BlogPostTranslation[];

  // ─── Timestamps ───
  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
