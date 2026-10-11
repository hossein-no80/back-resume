import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlogPost } from './blog-post.entity';

/**
 * یک section از مقاله (با تیتر و متن)
 */
export interface BlogSection {
  title: string;
  content: string;
}

@Entity('blog_post_translations')
@Unique(['postId', 'language'])
export class BlogPostTranslation {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'fa', description: 'کد زبان' })
  @Column({ type: 'varchar', length: 5 })
  language: string;

  @ApiProperty({
    example: 'راهنمای جامع امن‌سازی اپلیکیشن Next.js',
    maxLength: 200,
  })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({
    example: 'یادگیری روش‌های امنیتی ضروری...',
  })
  @Column({ type: 'text' })
  excerpt: string;

  @ApiPropertyOptional({
    example: 'در این مقاله درباره امن‌سازی...',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  intro: string | null;

  @ApiPropertyOptional({
    example: 'مهندس امنیت ارشد',
    nullable: true,
    description: 'سمت نویسنده (ترجمه‌شدنی)',
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  authorRole: string | null;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['Next.js', 'امنیت', 'احراز هویت', 'OWASP'],
  })
  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @ApiProperty({
    type: 'array',
    example: [
      { title: 'مقدمه', content: 'در توسعه مدرن...' },
      { title: 'نکات مهم', content: 'قبل از پیاده‌سازی...' },
    ],
    description: 'بخش‌های مقاله',
  })
  @Column({ type: 'jsonb', default: [] })
  sections: BlogSection[];

  // ─── Relation ───
  @ManyToOne(() => BlogPost, (p) => p.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: BlogPost;

  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @Column({ name: 'post_id', type: 'uuid' })
  postId: string;
}
