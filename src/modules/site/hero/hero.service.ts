import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Hero } from './entities/hero.entity';
import { HeroTranslation } from './entities/hero-translation.entity';
import { UpdateHeroDto } from './dto/upsert-hero.dto';
import { HeroTranslationDto } from './dto/upsert-hero.dto';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from '../../../common/constants';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface HeroResponse {
  language: string;
  title: string;
  subtitle: string;
  description: string;
  cta1: string;
  cta2: string;
  status: string;
  role: string;
}

export interface HeroFullResponse {
  translations: (HeroResponse & { id: number })[];
}

@Injectable()
export class HeroService {
  private readonly logger = new Logger(HeroService.name);

  constructor(
    @InjectRepository(Hero)
    private readonly heroRepo: Repository<Hero>,
    @InjectRepository(HeroTranslation)
    private readonly trRepo: Repository<HeroTranslation>,
    private readonly dataSource: DataSource,
  ) {}

  // ─────────────────────────────────────────────
  // GET /site/hero?lang=fa  (عمومی)
  // ─────────────────────────────────────────────
  async getByLanguage(lang: string = DEFAULT_LANGUAGE): Promise<HeroResponse> {
    const hero = await this.heroRepo.findOne({
      where: { id: 1 },
      relations: ['translations'],
    });

    if (!hero) throw new NotFoundException('Hero not found');

    const list = hero.translations ?? [];
    const t =
      list.find((x) => x.language === lang) ??
      list.find((x) => x.language === 'en') ??
      list.find((x) => x.language === 'fa') ??
      list[0];

    if (!t) throw new NotFoundException('No translation available');
    return this.toResponse(t);
  }

  // ─────────────────────────────────────────────
  // GET /site/hero/admin  (ادمین)
  // ─────────────────────────────────────────────
  async getAll(): Promise<HeroFullResponse> {
    const hero = await this.heroRepo.findOne({
      where: { id: 1 },
      relations: ['translations'],
    });
    if (!hero) throw new NotFoundException('Hero not found');

    return {
      translations: (hero.translations ?? []).map((t) => ({
        id: t.id,
        ...this.toResponse(t),
      })),
    };
  }

  // ─────────────────────────────────────────────
  // PATCH /site/hero  (ادمین) — replace کامل
  // ─────────────────────────────────────────────
  async patch(dto: UpdateHeroDto): Promise<HeroFullResponse> {
    if (!dto.translations) {
      return this.getAll();
    }

    this.validateLanguages(dto.translations);

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      let hero = await qr.manager.findOne(Hero, { where: { id: 1 } });
      if (!hero) {
        hero = new Hero();
        hero.id = 1;
        await qr.manager.save(hero);
      }

      await qr.manager.delete(HeroTranslation, { heroId: hero.id });

      const list = dto.translations.map((t) => {
        const tr = new HeroTranslation();
        tr.language = t.language;
        tr.title = t.title;
        tr.subtitle = t.subtitle;
        tr.description = t.description;
        tr.cta1 = t.cta1;
        tr.cta2 = t.cta2;
        tr.status = t.status;
        tr.role = t.role;
        tr.heroId = hero.id;
        return tr;
      });

      await qr.manager.save(list);
      await qr.commitTransaction();
      this.logger.log('Hero patched successfully');
      return await this.getAll();
    } catch (e) {
      await qr.rollbackTransaction();
      const err = e as Error;
      this.logger.error(`Hero patch failed: ${err.message}`, err.stack);
      throw new InternalServerErrorException(
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Error saving Hero',
      );
    } finally {
      await qr.release();
    }
  }

  // ─────────────────────────────────────────────
  // DELETE /site/hero  (ادمین)
  // ─────────────────────────────────────────────
  async remove(): Promise<{ message: string }> {
    const hero = await this.heroRepo.findOne({ where: { id: 1 } });
    if (!hero) throw new NotFoundException('Hero not found');

    await this.heroRepo.remove(hero);
    return { message: 'Hero deleted successfully' };
  }

  // ─────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────

  private toResponse(t: HeroTranslation): HeroResponse {
    return {
      language: t.language,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
      cta1: t.cta1,
      cta2: t.cta2,
      status: t.status,
      role: t.role,
    };
  }

  private validateLanguages(translations: HeroTranslationDto[]): void {
    const seen = new Set<string>();
    for (const t of translations) {
      if (!SUPPORTED_LANGUAGES.includes(t.language as never)) {
        throw new BadRequestException(`Unsupported language: ${t.language}`);
      }
      if (seen.has(t.language)) {
        throw new BadRequestException(`Duplicate language: ${t.language}`);
      }
      seen.add(t.language);
    }
  }
}
