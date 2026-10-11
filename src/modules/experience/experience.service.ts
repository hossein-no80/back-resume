import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Experience } from './entities/experience.entity';
import { ExperienceTranslation } from './entities/experience-translation.entity';
import { UpdateExperienceDto } from './dto/upsert-experience.dto';
import { ExperienceDto } from './dto/experience.dto';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../../common/constants';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ExperienceStats {
  yearsExperience: number;
  companies: number;
}

export interface ExperienceItemResponse {
  id: string;
  company: string;
  companyLogo: string | null;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  type: string;
  industry: string | null;
  website: string | null;
  featured: boolean;
  order: number;
  technologies: string[];
  description: string[];
  achievements: string[];
}

export interface ExperienceResponse {
  language: string;
  stats: ExperienceStats;
  experiences: ExperienceItemResponse[];
}

export interface ExperienceAdminResponse {
  stats: ExperienceStats;
  experiences: {
    id: string;
    company: string;
    companyLogo: string | null;
    startDate: string;
    endDate: string | null;
    type: string;
    website: string | null;
    featured: boolean;
    order: number;
    technologies: string[];
    translations: {
      id: number;
      language: string;
      position: string;
      location: string;
      industry: string | null;
      description: string[];
      achievements: string[];
    }[];
  }[];
}

@Injectable()
export class ExperienceService {
  private readonly logger = new Logger(ExperienceService.name);

  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,
    private readonly dataSource: DataSource,
  ) {}

  // ─────────────────────────────────────────────
  // GET /experiences?lang=fa  (عمومی)
  // ─────────────────────────────────────────────
  async getByLanguage(
    lang: string = DEFAULT_LANGUAGE,
  ): Promise<ExperienceResponse> {
    const experiences = await this.experienceRepo.find({
      relations: ['translations'],
      order: { order: 'ASC' },
    });

    if (experiences.length === 0) {
      throw new NotFoundException(
        'Experience not found. Please create it via PATCH /experiences',
      );
    }

    return {
      language: lang,
      stats: this.calculateStats(experiences),
      experiences: experiences.map((exp) => this.formatItem(exp, lang)),
    };
  }

  // ─────────────────────────────────────────────
  // GET /experiences/admin  (ادمین)
  // ─────────────────────────────────────────────
  async getAll(): Promise<ExperienceAdminResponse> {
    const experiences = await this.experienceRepo.find({
      relations: ['translations'],
      order: { order: 'ASC' },
    });

    if (experiences.length === 0) {
      throw new NotFoundException(
        'Experience not found. Please create it via PATCH /experiences',
      );
    }

    return {
      stats: this.calculateStats(experiences),
      experiences: experiences.map((exp) => ({
        id: exp.id,
        company: exp.company,
        companyLogo: exp.companyLogo,
        startDate: exp.startDate,
        endDate: exp.endDate,
        type: exp.type,
        website: exp.website,
        featured: exp.featured,
        order: exp.order,
        technologies: exp.technologies ?? [],
        translations: (exp.translations ?? []).map((t) => ({
          id: t.id,
          language: t.language,
          position: t.position,
          location: t.location,
          industry: t.industry,
          description: t.description ?? [],
          achievements: t.achievements ?? [],
        })),
      })),
    };
  }

  // ─────────────────────────────────────────────
  // PATCH /experiences  (ادمین) — replace کامل
  // ─────────────────────────────────────────────
  async patch(dto: UpdateExperienceDto): Promise<ExperienceAdminResponse> {
    if (!dto.experiences) {
      return this.getAll();
    }

    this.validateInput(dto.experiences);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ─── پاک کردن همه رکوردهای قبلی ───
      // delete با شرط خالی مجاز نیست → اول idها رو می‌گیریم
      const existing = await queryRunner.manager.find(Experience, {
        select: ['id'],
      });

      for (const exp of existing) {
        await queryRunner.manager.delete(Experience, { id: exp.id });
      }

      // ─── درج ساختار جدید ───
      for (const expDto of dto.experiences) {
        const experience = new Experience();
        experience.company = expDto.company;
        experience.companyLogo = expDto.companyLogo ?? null;
        experience.startDate = expDto.startDate;
        experience.endDate = expDto.endDate ?? null;
        experience.type = expDto.type;
        experience.website = expDto.website ?? null;
        experience.featured = expDto.featured;
        experience.order = expDto.order;
        experience.technologies = expDto.technologies ?? [];

        const savedExp = await queryRunner.manager.save(experience);

        // Translations
        const translations = expDto.translations.map((t) => {
          const tr = new ExperienceTranslation();
          tr.language = t.language;
          tr.position = t.position;
          tr.location = t.location;
          tr.industry = t.industry ?? null;
          tr.description = t.description ?? [];
          tr.achievements = t.achievements ?? [];
          tr.experienceId = savedExp.id;
          return tr;
        });

        await queryRunner.manager.save(translations);
      }

      await queryRunner.commitTransaction();
      this.logger.log('Experience patched successfully');

      return await this.getAll();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const err = error as Error;
      this.logger.error(`Error in Experience patch: ${err.message}`, err.stack);
      throw new InternalServerErrorException(
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Error saving Experience',
      );
    } finally {
      await queryRunner.release();
    }
  }

  // ─────────────────────────────────────────────
  // DELETE /experiences  (ادمین)
  // ─────────────────────────────────────────────
  async remove(): Promise<{ message: string }> {
    const count = await this.experienceRepo.count();
    if (count === 0) {
      throw new NotFoundException('Experience not found');
    }

    const existing = await this.experienceRepo.find({ select: ['id'] });
    for (const exp of existing) {
      await this.experienceRepo.delete({ id: exp.id });
    }

    return { message: 'Experience deleted successfully' };
  }

  // ─────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────

  /**
   * محاسبه خودکار آمار:
   * - yearsExperience: از قدیمی‌ترین startDate تا الان
   * - companies: تعداد کل تجربه‌ها
   */
  private calculateStats(experiences: Experience[]): ExperienceStats {
    const companies = experiences.length;

    // تمام startDateها رو پارس می‌کنیم و قدیمی‌ترین سال رو پیدا می‌کنیم
    const years = experiences
      .map((e) => this.extractYear(e.startDate))
      .filter((y): y is number => y !== null);

    let yearsExperience = 0;
    if (years.length > 0) {
      const oldestYear = Math.min(...years);
      const currentYear = new Date().getFullYear();
      yearsExperience = Math.max(0, currentYear - oldestYear);
    }

    return { yearsExperience, companies };
  }

  /**
   * استخراج سال از یه رشته تاریخ مثل "Jan 2024" یا "2024"
   * اگه نتونه → null
   */
  private extractYear(dateStr: string): number | null {
    const match = dateStr.match(/\d{4}/);
    if (!match) return null;
    const year = parseInt(match[0], 10);
    return Number.isNaN(year) ? null : year;
  }

  private formatItem(exp: Experience, lang: string): ExperienceItemResponse {
    const translations = exp.translations ?? [];

    const t =
      translations.find((x) => x.language === lang) ??
      translations.find((x) => x.language === 'en') ??
      translations.find((x) => x.language === 'fa') ??
      translations[0];

    if (!t) {
      throw new NotFoundException(
        `No translation available for experience #${exp.id}`,
      );
    }

    return {
      id: exp.id,
      company: exp.company,
      companyLogo: exp.companyLogo,
      position: t.position,
      location: t.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      type: exp.type,
      industry: t.industry,
      website: exp.website,
      featured: exp.featured,
      order: exp.order,
      technologies: exp.technologies ?? [],
      description: t.description ?? [],
      achievements: t.achievements ?? [],
    };
  }

  private validateInput(experiences: ExperienceDto[]): void {
    for (const exp of experiences) {
      this.validateLanguages(
        exp.translations.map((t) => t.language),
        `experience "${exp.company}"`,
      );
    }
  }

  private validateLanguages(languages: string[], context: string): void {
    const seen = new Set<string>();
    for (const lang of languages) {
      if (!SUPPORTED_LANGUAGES.includes(lang as never)) {
        throw new BadRequestException(
          `Language "${lang}" is not supported (in ${context})`,
        );
      }
      if (seen.has(lang)) {
        throw new BadRequestException(
          `Duplicate language "${lang}" in ${context}`,
        );
      }
      seen.add(lang);
    }
  }
}
