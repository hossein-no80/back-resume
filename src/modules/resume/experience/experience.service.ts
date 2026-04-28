import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';
import { ExperienceTranslation } from './entities/experience-translation.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { About } from '../../resume/about/entities/about.entity';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private expRepo: Repository<Experience>,
    @InjectRepository(ExperienceTranslation)
    private transRepo: Repository<ExperienceTranslation>,
  ) {}

  async create(about: About, dto: CreateExperienceDto): Promise<Experience> {
    const experience = this.expRepo.create({
      company: dto.company,
      location: dto.location,
      startDate: dto.startDate,
      endDate: dto.endDate,
      about,
      aboutId: about.id,
    });
    await this.expRepo.save(experience);

    const translations = dto.translations.map((t) =>
      this.transRepo.create({
        ...t,
        experience,
        experienceId: experience.id,
      }),
    );
    await this.transRepo.save(translations);
    experience.translations = translations;
    return experience;
  }

  async update(id: number, dto: UpdateExperienceDto): Promise<Experience> {
    const experience = await this.expRepo.findOne({
      where: { id },
      relations: ['translations'],
    });
    if (!experience) throw new NotFoundException('Experience not found');

    if (dto.company !== undefined) experience.company = dto.company;
    if (dto.location !== undefined) experience.location = dto.location;
    if (dto.startDate !== undefined) experience.startDate = dto.startDate;
    if (dto.endDate !== undefined) experience.endDate = dto.endDate;

    if (dto.translations) {
      await this.transRepo.delete({ experienceId: id });
      const newTranslations = dto.translations.map((t) =>
        this.transRepo.create({
          ...t,
          experience,
          experienceId: experience.id,
        }),
      );
      await this.transRepo.save(newTranslations);
      experience.translations = newTranslations;
    }

    await this.expRepo.save(experience);
    return experience;
  }

  async getByLanguage(id: number, language: string) {
    const exp = await this.expRepo.findOne({
      where: { id },
      relations: ['translations'],
    });
    if (!exp) throw new NotFoundException('Experience not found');
    const translation = exp.translations.find((t) => t.language === language);
    if (!translation) {
      const fallback = exp.translations[0];
      if (!fallback) throw new NotFoundException('No translation found');
      return {
        id: exp.id,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        title: fallback.title,
        description: fallback.description,
      };
    }
    return {
      id: exp.id,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      title: translation.title,
      description: translation.description,
    };
  }

  async remove(id: number) {
    const exp = await this.expRepo.findOne({ where: { id } });
    if (!exp) throw new NotFoundException('Experience not found');
    await this.transRepo.delete({ experienceId: id });
    await this.expRepo.remove(exp);
  }
}
