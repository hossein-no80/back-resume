// src/modules/resume/skill/entities/skill-translation.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Skill } from './skill.entity';

@Entity('skill_translations')
export class SkillTranslation {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'fa' })
  @Column({ length: 10 })
  language: string;

  @ApiProperty({ example: 'Node.js' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ example: 'پیشرفته', nullable: true })
  @Column({ length: 50, nullable: true })
  level: string;

  @ApiProperty({ example: 'FaIcon', nullable: true })
  @Column({ nullable: true })
  icon: string;

  @ApiProperty({ type: () => Skill, readOnly: true })
  @ManyToOne(() => Skill, (skill) => skill.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @ApiProperty({ example: 1, readOnly: true })
  @Column({ name: 'skill_id' })
  skillId: number;
}
