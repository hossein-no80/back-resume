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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  language: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Experience, (exp) => exp.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'experience_id' })
  experience: Experience;

  @Column({ name: 'experience_id' })
  experienceId: number;
}
