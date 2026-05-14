// src/modules/resume/experience/entities/experience-translation.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Experience } from './experience.entity';

@Entity('experience_translations')
export class ExperienceTranslation {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'fa', description: 'کد زبان (fa, en, ...)' })
  @Column({ length: 10 })
  language: string;

  @ApiProperty({ example: 'توسعه‌دهنده فول‌استک' })
  @Column({ length: 200 })
  title: string;

  @ApiProperty({ example: 'مسئولیت‌ها: طراحی API، پیاده‌سازی فرانت‌اند...' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ type: () => Experience, readOnly: true })
  @ManyToOne(() => Experience, (exp) => exp.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'experience_id' })
  experience: Experience;

  @ApiProperty({ example: 1, readOnly: true })
  @Column({ name: 'experience_id' })
  experienceId: number;
}
