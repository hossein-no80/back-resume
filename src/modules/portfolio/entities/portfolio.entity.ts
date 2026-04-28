import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { PortfolioImage } from './portfolio-image.entity';
import { Skill } from '../../resume/skill/entities/skill.entity';
import { PortfolioTranslation } from './portfolio-translation.entity';
import { PortfolioStatus } from './portfolio-status.enum';

@Entity('portfolios')
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  demoUrl: string;

  @Column({ type: 'date', nullable: true })
  projectDate: Date;

  @Column({
    type: 'enum',
    enum: PortfolioStatus,
    default: PortfolioStatus.DRAFT,
  })
  status: PortfolioStatus;

  @ManyToMany(() => Skill, (skill) => skill.portfolios)
  @JoinTable({ name: 'portfolio_skills' })
  skillsUsed: Skill[];

  @OneToMany(() => PortfolioImage, (image) => image.portfolio, { cascade: true })
  images: PortfolioImage[];

  @OneToMany(() => PortfolioTranslation, (trans) => trans.portfolio, { cascade: true })
  translations: PortfolioTranslation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
