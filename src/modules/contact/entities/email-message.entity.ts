// src/modules/contact/entities/email-message.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Contact } from './contact.entity';

@Entity('email_messages')
export class EmailMessage {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'علی رضایی' })
  @Column()
  senderName: string;

  @ApiProperty({ example: 'alirezaei@example.com' })
  @Column()
  senderEmail: string;

  @ApiProperty({ example: 'درخواست همکاری' })
  @Column()
  subject: string;

  @ApiProperty({ example: 'متن پیام...' })
  @Column({ type: 'text' })
  body: string;

  @ApiProperty({ example: 'https://example.com/file.pdf', nullable: true })
  @Column({ nullable: true })
  attachmentUrl: string;

  @ApiProperty({ type: () => Contact, readOnly: true })
  @ManyToOne(() => Contact, (contact) => contact.receivedEmails, { onDelete: 'CASCADE' })
  contact: Contact;

  @ApiProperty({ example: '1', readOnly: true })
  @Column()
  contactId: string;

  @ApiProperty()
  @CreateDateColumn()
  receivedAt: Date;
}
