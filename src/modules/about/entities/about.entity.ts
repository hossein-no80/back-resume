import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AboutTranslation } from './about-translation.entity';

@Entity('about')
export class About {
  @ApiProperty({ example: 1, description: 'شناسه ثابت (همیشه 1)' })
  @PrimaryColumn({ type: 'int', default: 1 })
  id: number;

  // ============ اطلاعات تک‌زبانه (مشترک بین همه زبان‌ها) ============
  @ApiProperty({ example: 'john.doe@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiPropertyOptional({ example: '+1 (555) 123-4567' })
  @Column({ nullable: true })
  phone: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @Column({ nullable: true })
  avatar: string;

  @ApiPropertyOptional({ example: '/resume.pdf' })
  @Column({ nullable: true })
  resumeUrl: string;

  @ApiPropertyOptional({ example: 'John_Doe_Resume.pdf' })
  @Column({ nullable: true })
  resumeFileName: string;

  // Social (URL یکسانه، ترجمه لازم نداره)
  @ApiPropertyOptional({ example: 'https://github.com/johndoe' })
  @Column({ nullable: true })
  github: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/johndoe' })
  @Column({ nullable: true })
  linkedin: string;

  @ApiPropertyOptional({ example: 'https://twitter.com/johndoe' })
  @Column({ nullable: true })
  twitter: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/@johndoe' })
  @Column({ nullable: true })
  youtube: string;

  @ApiPropertyOptional({ example: 'https://johndoe.dev' })
  @Column({ nullable: true })
  website: string;

  // وضعیت
  @ApiProperty({ example: true })
  @Column({ default: true })
  available: boolean;

  @ApiProperty({ example: true })
  @Column({ default: true })
  openToWork: boolean;

  // ============ Relations ============
  @ApiProperty({ type: () => [AboutTranslation] })
  @OneToMany(() => AboutTranslation, (t) => t.about, { cascade: true })
  translations: AboutTranslation[];

  // ============ Timestamps ============
  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
