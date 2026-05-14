// src/modules/about/entities/about-translation.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { About } from './about.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('about_translations')
export class AboutTranslation {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'fa', description: 'کد زبان (fa, en, ...)' })
  @Column({ length: 10 })
  language: string; // 'fa', 'en', ...

  @ApiProperty({ example: 'درباره' })
  @Column({ length: 200 })
  title: string;

  @ApiProperty({ example: 'درباره' })
  @Column({ type: 'text' })
  description: string;

  // در آینده اگر فیلدهای متنی دیگری نیاز به ترجمه داشت (مثلاً subtitle) به اینجا اضافه کن

  @ApiProperty({
    type: () => About,
    description: 'اطلاعات about مرتبط',
    readOnly: true,
  })
  @ManyToOne(() => About, (about) => about.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'about_id' })
  about: About;

  @ApiProperty({ example: 1 })
  @Column({ name: 'about_id' })
  aboutId: number;
}
