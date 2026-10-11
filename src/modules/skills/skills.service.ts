import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SkillCategory } from './entities/skill-category.entity';
import { SkillCategoryTranslation } from './entities/skill-category-translation.entity';
import { SkillItem } from './entities/skill-item.entity';
import { SkillItemTranslation } from './entities/skill-item-translation.entity';
import { UpdateSkillsDto } from './dto/upsert-skills.dto';
import { SkillCategoryDto } from './dto/skill-category.dto';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../../common/constants';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface SkillItemResponse {
  id: number;
  level: number;
  years: number | null;
  order: number;
  name: string;
  description: string | null;
}

export interface SkillCategoryResponse {
  id: number;
  key: string;
  icon: string;
  order: number;
  title: string;
  description: string;
  skills: SkillItemResponse[];
}

export interface SkillsStats {
  yearsExperience: number;
  technologies: number;
}

export interface SkillsResponse {
  language: string;
  stats: SkillsStats;
  categories: SkillCategoryResponse[];
}

export interface SkillsAdminResponse {
  stats: SkillsStats;
  categories: {
    id: number;
    key: string;
    icon: string;
    order: number;
    translations: {
      id: number;
      language: string;
      title: string;
      description: string;
    }[];
    skills: {
      id: number;
      level: number;
      years: number | null;
      order: number;
      translations: {
        id: number;
        language: string;
        name: string;
        description: string | null;
      }[];
    }[];
  }[];
}

@Injectable()
export class SkillsService {
  private readonly logger = new Logger(SkillsService.name);

  constructor(
    @InjectRepository(SkillCategory)
    private readonly categoryRepo: Repository<SkillCategory>,
    private readonly dataSource: DataSource,
  ) {}

  // ─────────────────────────────────────────────
  // GET /skills?lang=fa  (عمومی)
  // ─────────────────────────────────────────────
  async getByLanguage(
    lang: string = DEFAULT_LANGUAGE,
  ): Promise<SkillsResponse> {
    const categories = await this.categoryRepo.find({
      relations: ['translations', 'skills', 'skills.translations'],
      order: { order: 'ASC' },
    });

    if (categories.length === 0) {
      throw new NotFoundException(
        'Skills not found. Please create them via PATCH /skills',
      );
    }

    return {
      language: lang,
      stats: this.calculateStats(categories),
      categories: categories.map((cat) => this.formatCategory(cat, lang)),
    };
  }

  // ─────────────────────────────────────────────
  // GET /skills/admin  (ادمین)
  // ─────────────────────────────────────────────
  async getAll(): Promise<SkillsAdminResponse> {
    const categories = await this.categoryRepo.find({
      relations: ['translations', 'skills', 'skills.translations'],
      order: { order: 'ASC' },
    });

    if (categories.length === 0) {
      throw new NotFoundException(
        'Skills not found. Please create them via PATCH /skills',
      );
    }

    return {
      stats: this.calculateStats(categories),
      categories: categories.map((cat) => ({
        id: cat.id,
        key: cat.key,
        icon: cat.icon,
        order: cat.order,
        translations: (cat.translations ?? []).map((t) => ({
          id: t.id,
          language: t.language,
          title: t.title,
          description: t.description,
        })),
        skills: (cat.skills ?? [])
          .sort((a, b) => a.order - b.order)
          .map((item) => ({
            id: item.id,
            level: item.level,
            years: item.years,
            order: item.order,
            translations: (item.translations ?? []).map((t) => ({
              id: t.id,
              language: t.language,
              name: t.name,
              description: t.description,
            })),
          })),
      })),
    };
  }

  // ─────────────────────────────────────────────
  // PATCH /skills  (ادمین) — replace کل ساختار
  // ─────────────────────────────────────────────
  async patch(dto: UpdateSkillsDto): Promise<SkillsAdminResponse> {
    if (!dto.categories) {
      return this.getAll();
    }

    this.validateInput(dto.categories);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ─── پاک کردن همه categoryهای قبلی ───
      // چرا با find + loop؟ چون delete با شرط خالی مجاز نیست
      const existingCategories = await queryRunner.manager.find(SkillCategory, {
        select: ['id'],
      });

      for (const cat of existingCategories) {
        await queryRunner.manager.delete(SkillCategory, { id: cat.id });
      }

      // ─── درج ساختار جدید ───
      for (const catDto of dto.categories) {
        const category = new SkillCategory();
        category.key = catDto.key;
        category.icon = catDto.icon;
        category.order = catDto.order;

        const savedCategory = await queryRunner.manager.save(category);

        // Category translations
        const catTranslations = catDto.translations.map((t) => {
          const tr = new SkillCategoryTranslation();
          tr.language = t.language;
          tr.title = t.title;
          tr.description = t.description;
          tr.categoryId = savedCategory.id;
          return tr;
        });
        await queryRunner.manager.save(catTranslations);

        // Skills
        for (const itemDto of catDto.skills) {
          const item = new SkillItem();
          item.level = itemDto.level;
          item.years = itemDto.years ?? null;
          item.order = itemDto.order;
          item.categoryId = savedCategory.id;

          const savedItem = await queryRunner.manager.save(item);

          const itemTranslations = itemDto.translations.map((t) => {
            const tr = new SkillItemTranslation();
            tr.language = t.language;
            tr.name = t.name;
            tr.description = t.description ?? null;
            tr.itemId = savedItem.id;
            return tr;
          });
          await queryRunner.manager.save(itemTranslations);
        }
      }

      await queryRunner.commitTransaction();
      this.logger.log('Skills patched successfully');

      return await this.getAll();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const err = error as Error;
      this.logger.error(`Error in Skills patch: ${err.message}`, err.stack);
      throw new InternalServerErrorException(
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Error saving Skills',
      );
    } finally {
      await queryRunner.release();
    }
  }

  // ─────────────────────────────────────────────
  // DELETE /skills  (ادمین)
  // ─────────────────────────────────────────────
  async remove(): Promise<{ message: string }> {
    const count = await this.categoryRepo.count();
    if (count === 0) {
      throw new NotFoundException('Skills not found');
    }

    const existingCategories = await this.categoryRepo.find({
      select: ['id'],
    });
    for (const cat of existingCategories) {
      await this.categoryRepo.delete({ id: cat.id });
    }

    return { message: 'Skills deleted successfully' };
  }

  // ─────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────

  /**
   * محاسبه خودکار آمار:
   * - yearsExperience: بیشترین `years` از همه مهارت‌ها
   * - technologies: تعداد کل مهارت‌ها
   */
  private calculateStats(categories: SkillCategory[]): SkillsStats {
    const allSkills = categories.flatMap((c) => c.skills ?? []);

    const yearsExperience = allSkills.reduce(
      (max, item) => Math.max(max, item.years ?? 0),
      0,
    );

    const technologies = allSkills.length;

    return { yearsExperience, technologies };
  }

  private formatCategory(
    cat: SkillCategory,
    lang: string,
  ): SkillCategoryResponse {
    const translations = cat.translations ?? [];

    const t =
      translations.find((x) => x.language === lang) ??
      translations.find((x) => x.language === 'en') ??
      translations.find((x) => x.language === 'fa') ??
      translations[0];

    if (!t) {
      throw new NotFoundException(
        `No translation available for category "${cat.key}"`,
      );
    }

    const skills = (cat.skills ?? [])
      .sort((a, b) => a.order - b.order)
      .map((item) => this.formatItem(item, lang));

    return {
      id: cat.id,
      key: cat.key,
      icon: cat.icon,
      order: cat.order,
      title: t.title,
      description: t.description,
      skills,
    };
  }

  private formatItem(item: SkillItem, lang: string): SkillItemResponse {
    const translations = item.translations ?? [];

    const t =
      translations.find((x) => x.language === lang) ??
      translations.find((x) => x.language === 'en') ??
      translations.find((x) => x.language === 'fa') ??
      translations[0];

    if (!t) {
      throw new NotFoundException(
        `No translation available for skill item #${item.id}`,
      );
    }

    return {
      id: item.id,
      level: item.level,
      years: item.years,
      order: item.order,
      name: t.name,
      description: t.description,
    };
  }

  private validateInput(categories: SkillCategoryDto[]): void {
    const keys = new Set<string>();
    for (const cat of categories) {
      if (keys.has(cat.key)) {
        throw new BadRequestException(`Duplicate category key "${cat.key}"`);
      }
      keys.add(cat.key);

      this.validateLanguages(
        cat.translations.map((t) => t.language),
        `category "${cat.key}"`,
      );

      for (const item of cat.skills) {
        this.validateLanguages(
          item.translations.map((t) => t.language),
          `skill in category "${cat.key}"`,
        );
      }
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
