import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Experience } from '../../experience/entities/experience.entity';
import { Interest } from '../../interest/entities/interest.entity';
import { Skill } from '../../skill/entities/skill.entity';
import { AboutTranslation } from './about-translation.entity';

@Entity('about')
export class About {
  @PrimaryColumn({ type: 'int', default: 1 })
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  profilePicture: string | null;

  @Column({ type: 'varchar', nullable: true })
  proficientUser: string | null;

  @OneToMany(() => Experience, (exp) => exp.about, { cascade: true })
  experiences: Experience[];

  @OneToMany(() => Interest, (interest) => interest.about, { cascade: true })
  interests: Interest[];

  @OneToMany(() => Skill, (skill) => skill.about, { cascade: true })
  skills: Skill[];

  @OneToMany(() => AboutTranslation, (trans) => trans.about, { cascade: true })
  translations: AboutTranslation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
