// src/modules/resume/interest/entities/interest.entity.ts
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => About, readOnly: true })
  @ManyToOne(() => About, (about) => about.interests, { onDelete: 'CASCADE' })
  about: About;

  @ApiProperty({ example: 1, readOnly: true })
  @Column()
  aboutId: number;

  @ApiProperty({ type: () => [InterestTranslation], readOnly: true })
  @OneToMany(() => InterestTranslation, (trans) => trans.interest, {
    cascade: true,
  })
  translations: InterestTranslation[];
}
