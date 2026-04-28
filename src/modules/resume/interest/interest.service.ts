// src/modules/interest/interest.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import { InterestTranslation } from './entities/interest-translation.entity';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { About } from '../../resume/about/entities/about.entity';

@Injectable()
export class InterestService {
  constructor(
    @InjectRepository(Interest)
    private interestRepo: Repository<Interest>,
    @InjectRepository(InterestTranslation)
    private translationRepo: Repository<InterestTranslation>,
  ) {}

  async create(about: About, createDto: CreateInterestDto): Promise<Interest> {
    const interest = this.interestRepo.create({ about, aboutId: about.id });
    await this.interestRepo.save(interest);

    const translations = createDto.translations.map((transDto) =>
      this.translationRepo.create({
        ...transDto,
        interest,
        interestId: interest.id,
      }),
    );
    await this.translationRepo.save(translations);
    interest.translations = translations;
    return interest;
  }

  async update(id: number, updateDto: UpdateInterestDto): Promise<Interest> {
    const interest = await this.interestRepo.findOne({
      where: { id },
      relations: ['translations'],
    });
    if (!interest) throw new NotFoundException('Interest not found');

    if (updateDto.translations) {
      // حذف ترجمه‌های قبلی
      await this.translationRepo.delete({ interestId: id });
      // ایجاد ترجمه‌های جدید
      const newTranslations = updateDto.translations.map((transDto) =>
        this.translationRepo.create({
          ...transDto,
          interest,
          interestId: interest.id,
        }),
      );
      await this.translationRepo.save(newTranslations);
      interest.translations = newTranslations;
    }
    return interest;
  }

  async getByLanguage(interestId: number, language: string) {
    const interest = await this.interestRepo.findOne({
      where: { id: interestId },
      relations: ['translations'],
    });
    if (!interest) throw new NotFoundException('Interest not found');
    const translation = interest.translations.find((t) => t.language === language);
    if (!translation) {
      // fallback to first available language
      const fallback = interest.translations[0];
      if (!fallback) throw new NotFoundException('No translation found');
      return {
        id: interest.id,
        name: fallback.name,
        category: fallback.category,
      };
    }
    return {
      id: interest.id,
      name: translation.name,
      category: translation.category,
    };
  }

  async remove(id: number) {
    const interest = await this.interestRepo.findOne({ where: { id } });
    if (!interest) throw new NotFoundException('Interest not found');
    await this.translationRepo.delete({ interestId: id });
    await this.interestRepo.remove(interest);
  }
}