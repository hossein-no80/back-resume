import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Entity('portfolio_translations')
export class PortfolioTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  language: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 200, nullable: true })
  subtitle: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'portfolio_id' })
  portfolio: Portfolio;

  // ❌ Do NOT add an extra @Column for portfolioId here
}