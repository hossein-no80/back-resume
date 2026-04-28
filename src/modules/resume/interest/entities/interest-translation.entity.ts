// src/modules/about/entities/about-translation.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Interest } from './interest.entity';

@Entity('interest_translations')
export class InterestTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  language: string; // 'fa', 'en', ...

  @Column({ length: 200 })
  name: string;

  @Column({ length: 200 })
  category: string;

  // در آینده اگر فیلدهای متنی دیگری نیاز به ترجمه داشت (مثلاً subtitle) به اینجا اضافه کن

  @ManyToOne(() => Interest, (interest) => interest.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'interest_id' })
  interest: Interest;

  @Column({ name: 'interest_id' })
  interestId: number;
}
