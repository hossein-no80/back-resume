// src/modules/contact/contact.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from './entities/contact.entity';
import { EmailMessage } from './entities/email-message.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, EmailMessage, Message])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}