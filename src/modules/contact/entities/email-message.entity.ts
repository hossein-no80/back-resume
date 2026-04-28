// src/contact/entities/email-message.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Contact } from './contact.entity';

@Entity('email_messages')
export class EmailMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senderName: string;

  @Column()
  senderEmail: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ nullable: true })
  attachmentUrl: string;

  @ManyToOne(() => Contact, (contact) => contact.receivedEmails, { onDelete: 'CASCADE' })
  contact: Contact;

  @Column()
  contactId: string;

  @CreateDateColumn()
  receivedAt: Date;
}