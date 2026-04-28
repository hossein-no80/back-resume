// src/skill/entities/skill.entity.ts
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  language: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, nullable: true })
  level: string; // مبتدی، متوسط، پیشرفته

  @Column({ nullable: true })
  icon: string;

  @ManyToOne(() => Skill, (skill) => skill.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @Column({ name: 'skill_id' })
  skillId: number;
}
