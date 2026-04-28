// src/contact/entities/message.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Contact } from './contact.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sender: string; // 'کارشناس' یا 'admin' یا نام کاربر

  @ManyToOne(() => Contact, (contact) => contact.messages, { onDelete: 'CASCADE' })
  contact: Contact;

  @Column()
  contactId: string;

  @CreateDateColumn()
  timestamp: Date;
}