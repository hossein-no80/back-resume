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
import { ApiProperty } from '@nestjs/swagger';

@Entity('portfolios')
export class Portfolio {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'https://github.com/username/project',
    nullable: true,
  })
  @Column({ nullable: true })
  githubUrl: string;

  @ApiProperty({ example: 'https://demo.project.com', nullable: true })
  @Column({ nullable: true })
  demoUrl: string;

  @ApiProperty({ example: '2024-01-01', nullable: true })
  @Column({ type: 'date', nullable: true })
  projectDate: Date;

  @ApiProperty({ enum: PortfolioStatus })
  @Column({
    type: 'enum',
    enum: PortfolioStatus,
    default: PortfolioStatus.DRAFT,
  })
  status: PortfolioStatus;

  @ApiProperty({ type: [Skill], description: 'مهارت‌های استفاده شده' })
  @ManyToMany(() => Skill, (skill) => skill.portfolios)
  @JoinTable({ name: 'portfolio_skills' })
  skillsUsed: Skill[];

  @ApiProperty({ type: [PortfolioImage] })
  @OneToMany(() => PortfolioImage, (image) => image.portfolio, {
    cascade: true,
  })
  images: PortfolioImage[];

  @ApiProperty({ type: [PortfolioTranslation] })
  @OneToMany(() => PortfolioTranslation, (trans) => trans.portfolio, {
    cascade: true,
  })
  translations: PortfolioTranslation[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
