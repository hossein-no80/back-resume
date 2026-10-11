import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { About } from './entities/about.entity';
import { AboutTranslation } from './entities/about-translation.entity';
import { UpdateAboutDto } from './dto/upsert-about.dto';
import { AboutTranslationDto } from './dto/about-translation.dto';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../../common/constants';

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  website: string;
}

export interface AboutSingleResponse {
  email: string;
  phone: string;
  location: string | null;
  avatar: string;
  heading: string | null;
  bio: string;
  name: string;
  title: string;
  socialLinks: SocialLinks;
  available: boolean;
  openToWork: boolean;
  resumeUrl: string;
  resumeFileName: string;
  aboutSections: AboutTranslation['aboutSections'];
  expertise: AboutTranslation['expertise'];
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AboutFullResponse {
  email: string;
  phone: string;
  avatar: string;
  resumeUrl: string;
  resumeFileName: string;
  socialLinks: SocialLinks;
  available: boolean;
  openToWork: boolean;
  translations: {
    id: number;
    language: string;
    name: string;
    title: string;
    heading: string | null;
    bio: string;
    location: string | null;
    aboutSections: AboutTranslation['aboutSections'];
    expertise: AboutTranslation['expertise'];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AboutService {
  private readonly logger = new Logger(AboutService.name);

  constructor(
    @InjectRepository(About)
    private readonly aboutRepo: Repository<About>,
    @InjectRepository(AboutTranslation)
    private readonly translationRepo: Repository<AboutTranslation>,
    private readonly dataSource: DataSource,
  ) {}

  async getByLanguage(
    lang: string = DEFAULT_LANGUAGE,
  ): Promise<AboutSingleResponse> {
    const about = await this.aboutRepo.findOne({
      where: { id: 1 },
      relations: ['translations'],
    });

    if (!about) {
      throw new NotFoundException(
        'About record not found. Please create it via PATCH /about',
      );
    }

    const translations = about.translations ?? [];
    const translation =
      translations.find((t) => t.language === lang) ??
      translations.find((t) => t.language === 'en') ??
      translations.find((t) => t.language === 'fa') ??
      translations[0];

    if (!translation) {
      throw new NotFoundException('No translation available for About');
    }

    return this.formatSingle(about, translation);
  }

  async getAll(): Promise<AboutFullResponse> {
    const about = await this.aboutRepo.findOne({
      where: { id: 1 },
      relations: ['translations'],
    });

    if (!about) {
      throw new NotFoundException(
        'About record not found. Please create it via PATCH /about',
      );
    }

    return this.formatFull(about);
  }

  async patch(dto: UpdateAboutDto): Promise<AboutFullResponse> {
    if (dto.translations) {
      this.validateUniqueLanguages(dto.translations);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let about = await queryRunner.manager.findOne(About, {
        where: { id: 1 },
      });

      // اگه رکورد وجود نداره → برای ساخت، email الزامیه
      if (!about) {
        if (!dto.email) {
          throw new BadRequestException(
            'email is required to create About for the first time',
          );
        }
        about = new About();
        about.id = 1;
        about.available = true;
        about.openToWork = true;
      }

      // ── فقط فیلدهای ارسالی رو آپدیت کن ──
      if (dto.email !== undefined) about.email = dto.email;
      if (dto.phone !== undefined) about.phone = dto.phone ?? '';
      if (dto.avatar !== undefined) about.avatar = dto.avatar ?? '';
      if (dto.resumeUrl !== undefined) about.resumeUrl = dto.resumeUrl ?? '';
      if (dto.resumeFileName !== undefined)
        about.resumeFileName = dto.resumeFileName ?? '';
      if (dto.available !== undefined) about.available = dto.available;
      if (dto.openToWork !== undefined) about.openToWork = dto.openToWork;

      if (dto.socialLinks) {
        const s = dto.socialLinks;
        if (s.github !== undefined) about.github = s.github ?? '';
        if (s.linkedin !== undefined) about.linkedin = s.linkedin ?? '';
        if (s.twitter !== undefined) about.twitter = s.twitter ?? '';
        if (s.youtube !== undefined) about.youtube = s.youtube ?? '';
        if (s.website !== undefined) about.website = s.website ?? '';
      }

      await queryRunner.manager.save(about);

      // ── ترجمه‌ها: اگه فرستاده شدن → کامل جایگزین، وگرنه دست نزن ──
      if (dto.translations) {
        await queryRunner.manager.delete(AboutTranslation, {
          aboutId: about.id,
        });

        const translations = dto.translations.map((t: AboutTranslationDto) => {
          const tr = new AboutTranslation();
          tr.language = t.language;
          tr.name = t.name;
          tr.title = t.title;
          tr.heading = t.heading ?? null;
          tr.bio = t.bio;
          tr.location = t.location ?? null;
          tr.aboutSections = (t.aboutSections ??
            []) as AboutTranslation['aboutSections'];
          tr.expertise = (t.expertise ?? []) as AboutTranslation['expertise'];
          tr.about = about!;
          tr.aboutId = about.id;
          return tr;
        });

        await queryRunner.manager.save(translations);
      }

      await queryRunner.commitTransaction();
      this.logger.log('About patched successfully');

      return await this.getAll();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const err = error as Error;
      this.logger.error(`Error in About patch: ${err.message}`, err.stack);
      throw new InternalServerErrorException(
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Error saving About',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(): Promise<{ message: string }> {
    const about = await this.aboutRepo.findOne({ where: { id: 1 } });
    if (!about) {
      throw new NotFoundException('About not found');
    }
    await this.aboutRepo.remove(about);
    return { message: 'About deleted successfully' };
  }

  private formatSingle(about: About, t: AboutTranslation): AboutSingleResponse {
    return {
      email: about.email,
      phone: about.phone ?? '',
      location: t.location,
      avatar: about.avatar ?? '',
      heading: t.heading,
      bio: t.bio,
      name: t.name,
      title: t.title,
      socialLinks: {
        github: about.github ?? '',
        linkedin: about.linkedin ?? '',
        twitter: about.twitter ?? '',
        youtube: about.youtube ?? '',
        website: about.website ?? '',
      },
      available: about.available,
      openToWork: about.openToWork,
      resumeUrl: about.resumeUrl ?? '',
      resumeFileName: about.resumeFileName ?? '',
      aboutSections: t.aboutSections ?? [],
      expertise: t.expertise ?? [],
      language: t.language,
      createdAt: about.createdAt,
      updatedAt: about.updatedAt,
    };
  }

  private formatFull(about: About): AboutFullResponse {
    const translations = about.translations ?? [];
    return {
      email: about.email,
      phone: about.phone ?? '',
      avatar: about.avatar ?? '',
      resumeUrl: about.resumeUrl ?? '',
      resumeFileName: about.resumeFileName ?? '',
      socialLinks: {
        github: about.github ?? '',
        linkedin: about.linkedin ?? '',
        twitter: about.twitter ?? '',
        youtube: about.youtube ?? '',
        website: about.website ?? '',
      },
      available: about.available,
      openToWork: about.openToWork,
      translations: translations.map((t) => ({
        id: t.id,
        language: t.language,
        name: t.name,
        title: t.title,
        heading: t.heading,
        bio: t.bio,
        location: t.location,
        aboutSections: t.aboutSections ?? [],
        expertise: t.expertise ?? [],
      })),
      createdAt: about.createdAt,
      updatedAt: about.updatedAt,
    };
  }

  private validateUniqueLanguages(translations: AboutTranslationDto[]): void {
    const seen = new Set<string>();
    for (const t of translations) {
      if (!SUPPORTED_LANGUAGES.includes(t.language as never)) {
        throw new BadRequestException(
          `Language "${t.language}" is not supported`,
        );
      }
      if (seen.has(t.language)) {
        throw new BadRequestException(
          `Duplicate language "${t.language}" in translations`,
        );
      }
      seen.add(t.language);
    }
  }
}
