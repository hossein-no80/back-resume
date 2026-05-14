// src/modules/resume/experience/entities/experience.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
} from 'typeorm';
import { About } from '../../../resume/about/entities/about.entity';
import { ExperienceTranslation } from './experience-translation.entity';

@Entity('experiences')
export class Experience {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'شرکت فناوری برتر' })
  @Column()
  company: string;

  @ApiProperty({ example: 'تهران', nullable: true })
  @Column({ nullable: true })
  location: string;

  @ApiProperty({ example: '2022-01-01' })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({ example: '2023-12-31', nullable: true })
  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @ApiProperty({
    type: () => About,
    description: 'رکورد about مرتبط',
    readOnly: true,
  })
  @ManyToOne(() => About, (about) => about.experiences, { onDelete: 'CASCADE' })
  about: About;

  @ApiProperty({ example: 1, readOnly: true })
  @Column()
  aboutId: number;

  @ApiProperty({ type: () => [ExperienceTranslation], readOnly: true })
  @OneToMany(() => ExperienceTranslation, (trans) => trans.experience, {
    cascade: true,
  })
  translations: ExperienceTranslation[];
}
