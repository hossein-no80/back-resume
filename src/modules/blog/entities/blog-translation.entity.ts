import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Blog } from './blog.entity';

@Entity('blog_translations')
export class BlogTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  language: string; // 'fa', 'en', ...

  @Column({ length: 200 })
  title: string;

  @Column({ length: 200, nullable: true })
  subtitle: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Blog, (blog) => blog.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}