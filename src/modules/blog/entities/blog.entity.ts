import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Author } from './author.entity';
import { Tag } from './tag.entity';
import { Comment } from './comment.entity';
import { BlogTranslation } from './blog-translation.entity';
import { BlogStatus } from './blog-status.enum';
import { BlogImage } from './blog-image.entity';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string; // برای سئو و آدرس‌دهی – از عنوان تولید می‌شود

  @Column({
    type: 'enum',
    enum: BlogStatus,
    default: BlogStatus.DRAFT,
  })
  status: BlogStatus;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @ManyToOne(() => Author, (author) => author.blogs, { nullable: true })
  author: Author | null;

  @OneToMany(() => BlogImage, (image) => image.blog, { cascade: true })
  images: BlogImage[];

  @ManyToMany(() => Tag, (tag) => tag.blogs)
  @JoinTable({ name: 'blog_tags' })
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.blog, { cascade: true })
  comments: Comment[];

  @OneToMany(() => BlogTranslation, (trans) => trans.blog, { cascade: true })
  translations: BlogTranslation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
