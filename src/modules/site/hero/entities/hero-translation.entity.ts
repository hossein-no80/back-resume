import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Hero } from './hero.entity';

@Entity('hero_translations')
@Unique(['heroId', 'language'])
export class HeroTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 5 })
  language: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 200 })
  subtitle: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 100 })
  cta1: string;

  @Column({ length: 100 })
  cta2: string;

  @Column({ length: 200 })
  status: string;

  @Column({ length: 200 })
  role: string;

  @ManyToOne(() => Hero, (h) => h.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hero_id' })
  hero: Hero;

  @Column({ name: 'hero_id' })
  heroId: number;
}