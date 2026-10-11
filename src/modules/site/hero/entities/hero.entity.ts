import {
  Entity,
  PrimaryColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HeroTranslation } from './hero-translation.entity';

@Entity('hero')
export class Hero {
  @PrimaryColumn({ type: 'int', default: 1 })
  id: number;

  @OneToMany(() => HeroTranslation, (t) => t.hero, { cascade: true })
  translations: HeroTranslation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}