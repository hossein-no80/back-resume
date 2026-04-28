// src/modules/about/entities/about-translation.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { About } from './about.entity';

@Entity('about_translations')
export class AboutTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  language: string; // 'fa', 'en', ...

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  // در آینده اگر فیلدهای متنی دیگری نیاز به ترجمه داشت (مثلاً subtitle) به اینجا اضافه کن

  @ManyToOne(() => About, (about) => about.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'about_id' })
  about: About;

  @Column({ name: 'about_id' })
  aboutId: number;
}
