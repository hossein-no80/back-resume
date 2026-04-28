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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @ManyToOne(() => About, (about) => about.experiences, { onDelete: 'CASCADE' })
  about: About;

  @Column()
  aboutId: number;

  @OneToMany(() => ExperienceTranslation, (trans) => trans.experience, {
    cascade: true,
  })
  translations: ExperienceTranslation[];
}
