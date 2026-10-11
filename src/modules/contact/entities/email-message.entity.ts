import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('email_messages')
export class EmailMessage {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'علی رضایی' })
  @Column({ type: 'varchar', length: 100 })
  senderName: string;

  @ApiProperty({ example: 'alirezaei@example.com' })
  @Column({ type: 'varchar', length: 150 })
  senderEmail: string;

  @ApiProperty({ example: 'درخواست همکاری' })
  @Column({ type: 'varchar', length: 200 })
  subject: string;

  @ApiProperty({ example: 'متن پیام...' })
  @Column({ type: 'text' })
  body: string;

  @ApiPropertyOptional({
    example: 'https://example.com/file.pdf',
    nullable: true,
  })
  @Column({ type: 'varchar', nullable: true })
  attachmentUrl: string | null;

  @ApiPropertyOptional({
    example: '127.0.0.1',
    description: 'IP فرستنده (برای ضد اسپم)',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 45, nullable: true })
  senderIp: string | null;

  @ApiProperty({
    example: false,
    description: 'آیا پیام خونده شده؟',
  })
  @Column({ default: false })
  isRead: boolean;

  @ApiProperty({ example: '2026-10-11T20:29:34.062Z' })
  @CreateDateColumn()
  receivedAt: Date;
}
