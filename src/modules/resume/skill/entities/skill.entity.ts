// src/modules/skill/entities/skill.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { About } from '../../../resume/about/entities/about.entity';
import { SkillTranslation } from './skill-translation.entity';
import { Portfolio } from '../../../portfolio/entities/portfolio.entity'; // اضافه کردن import

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => About, (about) => about.skills, { onDelete: 'CASCADE' })
  about: About;

  @Column()
  aboutId: number;

  @OneToMany(() => SkillTranslation, (trans) => trans.skill, { cascade: true })
  translations: SkillTranslation[];

  // اضافه کردن سمت مقابل رابطه ManyToMany با Portfolio
  @ManyToMany(() => Portfolio, (portfolio) => portfolio.skillsUsed)
  portfolios: Portfolio[];
}