// src/modules/resume/interest/entities/interest-translation.entity.ts
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'fa' })
  @Column({ length: 10 })
  language: string;

  @ApiProperty({ example: 'برنامه‌نویسی' })
  @Column({ length: 200 })
  name: string;

  @ApiProperty({ example: 'تکنولوژی' })
  @Column({ length: 200 })
  category: string;

  @ApiProperty({ type: () => Interest, readOnly: true })
  @ManyToOne(() => Interest, (interest) => interest.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'interest_id' })
  interest: Interest;

  @ApiProperty({ example: 1, readOnly: true })
  @Column({ name: 'interest_id' })
  interestId: number;
}
