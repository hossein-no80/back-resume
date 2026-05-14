// src/modules/contact/entities/contact.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { EmailMessage } from './email-message.entity';

@Entity('contacts')
export class Contact {
  @ApiProperty({ example: '1', description: 'شناسه ثابت (همیشه 1)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'admin@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: '09123456789', nullable: true })
  @Column({ nullable: true })
  mobilePhone: string;

  @ApiProperty({ example: '021-12345678', nullable: true })
  @Column({ nullable: true })
  landlinePhone: string;

  @ApiProperty({ example: 'تهران، خیابان آزادی، پلاک ۱۲', nullable: true })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({ example: 'https://instagram.com/username', nullable: true })
  @Column({ nullable: true })
  instagramUrl: string;

  @ApiProperty({ example: 'https://t.me/username', nullable: true })
  @Column({ nullable: true })
  telegramUrl: string;

  @ApiProperty({ example: 'https://github.com/username', nullable: true })
  @Column({ nullable: true })
  githubUrl: string;

  @ApiProperty({ example: 'https://linkedin.com/in/username', nullable: true })
  @Column({ nullable: true })
  linkedinUrl: string;

  @ApiProperty({ type: () => [Message], readOnly: true })
  @OneToMany(() => Message, (message) => message.contact, { cascade: true })
  messages: Message[];

  @ApiProperty({ type: () => [EmailMessage], readOnly: true })
  @OneToMany(() => EmailMessage, (email) => email.contact, { cascade: true })
  receivedEmails: EmailMessage[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
