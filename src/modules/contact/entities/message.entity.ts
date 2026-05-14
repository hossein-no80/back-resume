// src/modules/contact/entities/message.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Contact } from './contact.entity';

@Entity('messages')
export class Message {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'مدیر سایت' })
  @Column()
  sender: string;

  @ApiProperty({ type: () => Contact, readOnly: true })
  @ManyToOne(() => Contact, (contact) => contact.messages, { onDelete: 'CASCADE' })
  contact: Contact;

  @ApiProperty({ example: '1', readOnly: true })
  @Column()
  contactId: string;

  @ApiProperty()
  @CreateDateColumn()
  timestamp: Date;
}
