// src/interest/entities/interest.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { About } from '../../../resume/about/entities/about.entity';
import { InterestTranslation } from './interest-translation.entity';

@Entity('interests')
export class Interest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => About, (about) => about.interests, { onDelete: 'CASCADE' })
  about: About;

  @Column()
  aboutId: number;

  @OneToMany(() => InterestTranslation, (trans) => trans.interest, {
    cascade: true,
  })
  translations: InterestTranslation[];
}
