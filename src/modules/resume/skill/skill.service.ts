import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { SkillTranslation } from './entities/skill-translation.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { About } from '../../resume/about/entities/about.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepo: Repository<Skill>,
    @InjectRepository(SkillTranslation)
    private transRepo: Repository<SkillTranslation>,
  ) {}

  async create(about: About, dto: CreateSkillDto): Promise<Skill> {
    const skill = this.skillRepo.create({ about, aboutId: about.id });
    await this.skillRepo.save(skill);

    const translations = dto.translations.map((t) =>
      this.transRepo.create({
        ...t,
        skill,
        skillId: skill.id,
      }),
    );
    await this.transRepo.save(translations);
    skill.translations = translations;
    return skill;
  }

  async update(id: number, dto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.skillRepo.findOne({
      where: { id },
      relations: ['translations'],
    });
    if (!skill) throw new NotFoundException('Skill not found');

    if (dto.translations) {
      await this.transRepo.delete({ skillId: id });
      const newTranslations = dto.translations.map((t) =>
        this.transRepo.create({
          ...t,
          skill,
          skillId: skill.id,
        }),
      );
      await this.transRepo.save(newTranslations);
      skill.translations = newTranslations;
    }
    return skill;
  }

  async getByLanguage(id: number, language: string) {
    const skill = await this.skillRepo.findOne({
      where: { id },
      relations: ['translations'],
    });
    if (!skill) throw new NotFoundException('Skill not found');
    const translation = skill.translations.find((t) => t.language === language);
    if (!translation) {
      const fallback = skill.translations[0];
      if (!fallback) throw new NotFoundException('No translation found');
      return {
        id: skill.id,
        name: fallback.name,
        level: fallback.level,
        icon: fallback.icon,
      };
    }
    return {
      id: skill.id,
      name: translation.name,
      level: translation.level,
      icon: translation.icon,
    };
  }

  async remove(id: number) {
    const skill = await this.skillRepo.findOne({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    await this.transRepo.delete({ skillId: id });
    await this.skillRepo.remove(skill);
  }
}
