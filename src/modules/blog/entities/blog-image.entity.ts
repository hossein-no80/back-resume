import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Blog } from './blog.entity';

@Entity('blog_images')
export class BlogImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  caption: string;

  @Column({ nullable: true })
  altText: string;

  @Column({ default: 0 })
  order: number; // ترتیب نمایش

  @ManyToOne(() => Blog, (blog) => blog.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}