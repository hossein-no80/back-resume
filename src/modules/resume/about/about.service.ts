import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError, DataSource } from 'typeorm';
import { About } from './entities/about.entity';
import { AboutTranslation } from './entities/about-translation.entity';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { Experience } from '../experience/entities/experience.entity';
import { Interest } from '../interest/entities/interest.entity';
import { Skill } from '../skill/entities/skill.entity';
import { ExperienceService } from '../experience/experience.service';
import { InterestService } from '../interest/interest.service';
import { SkillService } from '../skill/skill.service';
import { DEFAULT_LANGUAGE } from '../../../common/constants';

@Injectable()
export class AboutService {
  private readonly logger = new Logger(AboutService.name);

  constructor(
    @InjectRepository(About)
    private aboutRepo: Repository<About>,
    @InjectRepository(AboutTranslation)
    private translationRepo: Repository<AboutTranslation>,
    @InjectRepository(Experience)
    private expRepo: Repository<Experience>,
    @InjectRepository(Interest)
    private interestRepo: Repository<Interest>,
    @InjectRepository(Skill)
    private skillRepo: Repository<Skill>,
    private dataSource: DataSource,
    private experienceService: ExperienceService,
    private interestService: InterestService,
    private skillService: SkillService,
  ) {}

  private async getAboutEntity(id: number = 1): Promise<About> {
    const about = await this.aboutRepo.findOne({
      where: { id },
      relations: [
        'translations',
        'experiences',
        'experiences.translations',
        'interests',
        'interests.translations',
        'skills',
        'skills.translations',
      ],
    });
    if (!about) throw new NotFoundException('About not found');
    return about;
  }

  private getTranslatedExperience(exp: Experience, language: string) {
    const translation = exp.translations?.find((t) => t.language === language);
    if (!translation) {
      const fallback = exp.translations?.[0];
      if (!fallback) {
        return {
          id: exp.id,
          company: exp.company,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate,
          title: '',
          description: '',
        };
      }
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

  private getTranslatedInterest(interest: Interest, language: string) {
    const translation = interest.translations?.find((t) => t.language === language);
    if (!translation) {
      const fallback = interest.translations?.[0];
      return {
        id: interest.id,
        name: fallback?.name || '',
        category: fallback?.category || '',
      };
    }
    return {
      id: interest.id,
      name: translation.name,
      category: translation.category,
    };
  }

  private getTranslatedSkill(skill: Skill, language: string) {
    const translation = skill.translations?.find((t) => t.language === language);
    if (!translation) {
      const fallback = skill.translations?.[0];
      return {
        id: skill.id,
        name: fallback?.name || '',
        level: fallback?.level || '',
        icon: fallback?.icon || '',
      };
    }
    return {
      id: skill.id,
      name: translation.name,
      level: translation.level,
      icon: translation.icon,
    };
  }

  async getAbout(language: string = DEFAULT_LANGUAGE) {
    const about = await this.getAboutEntity();
    const translation = about.translations.find((t) => t.language === language);
    if (!translation) {
      const fallbackTranslation = about.translations[0];
      if (!fallbackTranslation) {
        throw new NotFoundException('No translation found for about');
      }
      return {
        id: about.id,
        email: about.email,
        profilePicture: about.profilePicture,
        proficientUser: about.proficientUser,
        title: fallbackTranslation.title,
        description: fallbackTranslation.description,
        experiences: about.experiences?.map((exp) => this.getTranslatedExperience(exp, language)) || [],
        interests: about.interests?.map((interest) => this.getTranslatedInterest(interest, language)) || [],
        skills: about.skills?.map((skill) => this.getTranslatedSkill(skill, language)) || [],
        createdAt: about.createdAt,
        updatedAt: about.updatedAt,
      };
    }
    return {
      id: about.id,
      email: about.email,
      profilePicture: about.profilePicture,
      proficientUser: about.proficientUser,
      title: translation.title,
      description: translation.description,
      experiences: about.experiences?.map((exp) => this.getTranslatedExperience(exp, language)) || [],
      interests: about.interests?.map((interest) => this.getTranslatedInterest(interest, language)) || [],
      skills: about.skills?.map((skill) => this.getTranslatedSkill(skill, language)) || [],
      createdAt: about.createdAt,
      updatedAt: about.updatedAt,
    };
  }

  async createOrUpdate(createAboutDto: CreateAboutDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let about = await queryRunner.manager.findOne(About, {
        where: { id: 1 },
        relations: ['experiences', 'interests', 'skills'],
      });

      if (!about) {
        about = queryRunner.manager.create(About, {
          id: 1,
          email: createAboutDto.email,
          profilePicture: createAboutDto.profilePicture,
          proficientUser: createAboutDto.proficientUser,
        });
        await queryRunner.manager.save(about);
      } else {
        about.email = createAboutDto.email;
        about.profilePicture = createAboutDto.profilePicture ?? null;
        about.proficientUser = createAboutDto.proficientUser ?? null;
        await queryRunner.manager.save(about);
      }

      // ترجمه‌ها
      if (createAboutDto.translations?.length) {
        await queryRunner.manager.delete(AboutTranslation, { aboutId: about.id });
        const newTranslations = createAboutDto.translations.map((transDto) =>
          queryRunner.manager.create(AboutTranslation, {
            ...transDto,
            about,
            aboutId: about.id,
          }),
        );
        await queryRunner.manager.save(newTranslations);
      }

      // حذف روابط قبلی در تراکنش
      if (about.experiences?.length) {
        await queryRunner.manager.remove(about.experiences);
      }
      if (about.interests?.length) {
        await queryRunner.manager.remove(about.interests);
      }
      if (about.skills?.length) {
        await queryRunner.manager.remove(about.skills);
      }

      // ایجاد تجربیات جدید با استفاده از سرویس (که از همان queryRunner استفاده نمی‌کند، بنابراین باید مستقیماً از manager استفاده کنیم)
      if (createAboutDto.experiences?.length) {
        const newExperiences = createAboutDto.experiences.map((exp) => {
          const e = queryRunner.manager.create(Experience, exp);
          e.about = about;
          e.aboutId = about.id;
          return e;
        });
        await queryRunner.manager.save(newExperiences);
      }

      // ایجاد علایق جدید با استفاده از سرویس (برای سادگی با Promise.all)
      if (createAboutDto.interests?.length) {
        await Promise.all(
          createAboutDto.interests.map((intDto) =>
            this.interestService.create(about, intDto),
          ),
        );
      }

      // ایجاد مهارت‌های جدید
      if (createAboutDto.skills?.length) {
        const newSkills = createAboutDto.skills.map((skill) => {
          const s = queryRunner.manager.create(Skill, skill);
          s.about = about;
          s.aboutId = about.id;
          return s;
        });
        await queryRunner.manager.save(newSkills);
      }

      await queryRunner.commitTransaction();
      return this.getAbout(DEFAULT_LANGUAGE);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error in createOrUpdate', error.stack);
      if (error instanceof QueryFailedError && (error as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException(
        process.env.NODE_ENV === 'development' ? error.message : 'Error saving about',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async update(updateAboutDto: UpdateAboutDto) {
    const existing = await this.getAboutEntity();

    // تبدیل به DTO برای ادغام (همان منطق قبلی ولی با سرویس‌های مجزا می‌توان بهینه کرد)
    const existingExperiencesDto = existing.experiences.map((exp) => ({
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      translations: exp.translations.map((t) => ({
        language: t.language,
        title: t.title,
        description: t.description,
      })),
    }));

    const existingInterestsDto = existing.interests.map((interest) => ({
      translations: interest.translations.map((t) => ({
        language: t.language,
        name: t.name,
        category: t.category,
      })),
    }));

    const existingSkillsDto = existing.skills.map((skill) => ({
      translations: skill.translations.map((t) => ({
        language: t.language,
        name: t.name,
        level: t.level,
        icon: t.icon,
      })),
    }));

    const mergedDto: CreateAboutDto = {
      email: updateAboutDto.email ?? existing.email,
      profilePicture: updateAboutDto.profilePicture ?? existing.profilePicture,
      proficientUser: updateAboutDto.proficientUser ?? existing.proficientUser,
      translations:
        updateAboutDto.translations ??
        existing.translations.map((t) => ({
          language: t.language,
          title: t.title,
          description: t.description,
        })),
      experiences: updateAboutDto.experiences ?? existingExperiencesDto,
      interests: updateAboutDto.interests ?? existingInterestsDto,
      skills: updateAboutDto.skills ?? existingSkillsDto,
    };
    return this.createOrUpdate(mergedDto);
  }

  async remove() {
    const about = await this.getAboutEntity();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(AboutTranslation, { aboutId: about.id });
      await queryRunner.manager.delete(Experience, { aboutId: about.id });
      await queryRunner.manager.delete(Interest, { aboutId: about.id });
      await queryRunner.manager.delete(Skill, { aboutId: about.id });
      await queryRunner.manager.remove(about);
      await queryRunner.commitTransaction();
      return { message: 'About deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error in remove', error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
