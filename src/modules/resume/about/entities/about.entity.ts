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
import { ApiProperty } from '@nestjs/swagger';

@Entity('about')
export class About {
  @ApiProperty({ example: 1 })
  @PrimaryColumn({ type: 'int', default: () => 1 })
  id: number;

  @ApiProperty({ example: 'admin@example.com' })
  @Column({ type: 'varchar', unique: true })
  email: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  profilePicture: string | null;

  @ApiProperty({ example: 'https://github.com/username', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  proficientUser: string | null;

  @ApiProperty({ type: [Experience] })
  @OneToMany(() => Experience, (exp) => exp.about, { cascade: true })
  experiences: Experience[];

  @ApiProperty({ type: [Interest] })
  @OneToMany(() => Interest, (interest) => interest.about, { cascade: true })
  interests: Interest[];

  @ApiProperty({ type: [Skill] })
  @OneToMany(() => Skill, (skill) => skill.about, { cascade: true })
  skills: Skill[];

  @ApiProperty({ type: [AboutTranslation] })
  @OneToMany(() => AboutTranslation, (trans) => trans.about, { cascade: true })
  translations: AboutTranslation[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
