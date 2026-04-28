// src/blog/entities/blog.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Author } from './author.entity';
import { Tag } from './tag.entity';
import { Comment } from './comment.entity';
import { BlogStatus } from './blog-status.enum';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'varchar', default: BlogStatus.DRAFT })
  status: BlogStatus;

  @Column({ type: 'text', nullable: true })
  subtitle: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  sublist: string;

  @Column({ default: 'ID' })
  additionalIngenuis: string;

  @ManyToOne(() => Author, (author) => author.blogs)
  author: Author;

  @Column()
  authorId: string;

  @ManyToMany(() => Tag, (tag) => tag.blogs)
  @JoinTable({ name: 'blog_tags' })
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.blog, { cascade: true })
  comments: Comment[];

  @CreateDateColumn()
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}