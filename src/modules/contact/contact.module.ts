import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from './entities/contact.entity';
import { ContactTranslation } from './entities/contact-translation.entity';
import { EmailMessage } from './entities/email-message.entity';
import { ContactSeeder } from '../../database/seeder/contact.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact, ContactTranslation, EmailMessage]),
  ],
  controllers: [ContactController],
  providers: [ContactService, ContactSeeder],
  exports: [ContactService],
})
export class ContactModule {}
