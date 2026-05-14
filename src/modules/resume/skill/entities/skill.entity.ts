// src/modules/resume/skill/entities/skill.entity.ts
import { ApiProperty } from '@nestjs/swagger';
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
import { Portfolio } from '../../../portfolio/entities/portfolio.entity';

@Entity('skills')
export class Skill {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => About, readOnly: true })
  @ManyToOne(() => About, (about) => about.skills, { onDelete: 'CASCADE' })
  about: About;

  @ApiProperty({ example: 1, readOnly: true })
  @Column()
  aboutId: number;

  @ApiProperty({ type: () => [SkillTranslation], readOnly: true })
  @OneToMany(() => SkillTranslation, (trans) => trans.skill, { cascade: true })
  translations: SkillTranslation[];

  @ApiProperty({ type: () => [Portfolio], readOnly: true })
  @ManyToMany(() => Portfolio, (portfolio) => portfolio.skillsUsed)
  portfolios: Portfolio[];
}
