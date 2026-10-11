import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectTranslation } from './entities/project-translation.entity';
import { UpdateProjectsDto } from './dto/upsert-project.dto';
import { ProjectDto } from './dto/project.dto';
import { ProjectCategory } from './enums/project.enums';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../../common/constants';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ProjectStats {
  total: number;
  featured: number;
  byCategory: Record<string, number>;
}

export interface ProjectItemResponse {
  id: string;
  title: string;
  description: string;
  longDescription: string | null;
  category: string;
  tags: string[];
  image: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  techStack: string[];
  features: string[];
  date: string;
  stats: {
    stars: number | null;
    forks: number | null;
    views: number | null;
    users: number | null;
  } | null;
  status: string;
  featured: boolean;
  order: number;
}

export interface ProjectResponse {
  language: string;
  stats: ProjectStats;
  projects: ProjectItemResponse[];
}

export interface ProjectAdminResponse {
  stats: ProjectStats;
  projects: {
    id: string;
    category: string;
    image: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
    techStack: string[];
    date: string;
    status: string;
    featured: boolean;
    order: number;
    statsStars: number | null;
    statsForks: number | null;
    statsViews: number | null;
    statsUsers: number | null;
    translations: {
      id: number;
      language: string;
      title: string;
      description: string;
      longDescription: string | null;
      tags: string[];
      features: string[];
    }[];
  }[];
}

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    private readonly dataSource: DataSource,
  ) {}

  // ─────────────────────────────────────────────
  // GET /projects?lang=fa  (عمومی)
  // ─────────────────────────────────────────────
  async getByLanguage(
    lang: string = DEFAULT_LANGUAGE,
  ): Promise<ProjectResponse> {
    const projects = await this.projectRepo.find({
      relations: ['translations'],
      order: { order: 'ASC' },
    });

    if (projects.length === 0) {
      throw new NotFoundException(
        'Projects not found. Please create them via PATCH /projects',
      );
    }

    return {
      language: lang,
      stats: this.calculateStats(projects),
      projects: projects.map((p) => this.formatItem(p, lang)),
    };
  }

  // ─────────────────────────────────────────────
  // GET /projects/admin  (ادمین)
  // ─────────────────────────────────────────────
  async getAll(): Promise<ProjectAdminResponse> {
    const projects = await this.projectRepo.find({
      relations: ['translations'],
      order: { order: 'ASC' },
    });

    if (projects.length === 0) {
      throw new NotFoundException(
        'Projects not found. Please create them via PATCH /projects',
      );
    }

    return {
      stats: this.calculateStats(projects),
      projects: projects.map((p) => ({
        id: p.id,
        category: p.category,
        image: p.image,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        techStack: p.techStack ?? [],
        date: p.date,
        status: p.status,
        featured: p.featured,
        order: p.order,
        statsStars: p.statsStars,
        statsForks: p.statsForks,
        statsViews: p.statsViews,
        statsUsers: p.statsUsers,
        translations: (p.translations ?? []).map((t) => ({
          id: t.id,
          language: t.language,
          title: t.title,
          description: t.description,
          longDescription: t.longDescription,
          tags: t.tags ?? [],
          features: t.features ?? [],
        })),
      })),
    };
  }

  // ─────────────────────────────────────────────
  // PATCH /projects  (ادمین) — replace کامل
  // ─────────────────────────────────────────────
  async patch(dto: UpdateProjectsDto): Promise<ProjectAdminResponse> {
    if (!dto.projects) {
      return this.getAll();
    }

    this.validateInput(dto.projects);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ─── پاک کردن همه پروژه‌های قبلی ───
      const existing = await queryRunner.manager.find(Project, {
        select: ['id'],
      });

      for (const p of existing) {
        await queryRunner.manager.delete(Project, { id: p.id });
      }

      // ─── درج ساختار جدید ───
      for (const pDto of dto.projects) {
        const project = new Project();
        project.category = pDto.category;
        project.image = pDto.image ?? null;
        project.githubUrl = pDto.githubUrl ?? null;
        project.liveUrl = pDto.liveUrl ?? null;
        project.techStack = pDto.techStack ?? [];
        project.date = pDto.date;
        project.status = pDto.status;
        project.featured = pDto.featured;
        project.order = pDto.order;
        project.statsStars = pDto.statsStars ?? null;
        project.statsForks = pDto.statsForks ?? null;
        project.statsViews = pDto.statsViews ?? null;
        project.statsUsers = pDto.statsUsers ?? null;

        const savedProject = await queryRunner.manager.save(project);

        // Translations
        const translations = pDto.translations.map((t) => {
          const tr = new ProjectTranslation();
          tr.language = t.language;
          tr.title = t.title;
          tr.description = t.description;
          tr.longDescription = t.longDescription ?? null;
          tr.tags = t.tags ?? [];
          tr.features = t.features ?? [];
          tr.projectId = savedProject.id;
          return tr;
        });

        await queryRunner.manager.save(translations);
      }

      await queryRunner.commitTransaction();
      this.logger.log('Projects patched successfully');

      return await this.getAll();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const err = error as Error;
      this.logger.error(`Error in Projects patch: ${err.message}`, err.stack);
      throw new InternalServerErrorException(
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Error saving Projects',
      );
    } finally {
      await queryRunner.release();
    }
  }

  // ─────────────────────────────────────────────
  // DELETE /projects  (ادمین)
  // ─────────────────────────────────────────────
  async remove(): Promise<{ message: string }> {
    const count = await this.projectRepo.count();
    if (count === 0) {
      throw new NotFoundException('Projects not found');
    }

    const existing = await this.projectRepo.find({ select: ['id'] });
    for (const p of existing) {
      await this.projectRepo.delete({ id: p.id });
    }

    return { message: 'Projects deleted successfully' };
  }

  // ─────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────

  /**
   * محاسبه خودکار آمار:
   * - total: تعداد کل پروژه‌ها
   * - featured: تعداد پروژه‌های featured
   * - byCategory: تعداد به تفکیک هر دسته
   */
  private calculateStats(projects: Project[]): ProjectStats {
    const total = projects.length;
    const featured = projects.filter((p) => p.featured).length;

    const byCategory: Record<string, number> = {};
    // همه categoryها رو با مقدار صفر initialize کن
    Object.values(ProjectCategory).forEach((cat) => {
      byCategory[cat] = 0;
    });
    // شمارش
    for (const p of projects) {
      byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
    }

    return { total, featured, byCategory };
  }

  private formatItem(p: Project, lang: string): ProjectItemResponse {
    const translations = p.translations ?? [];

    const t =
      translations.find((x) => x.language === lang) ??
      translations.find((x) => x.language === 'en') ??
      translations.find((x) => x.language === 'fa') ??
      translations[0];

    if (!t) {
      throw new NotFoundException(
        `No translation available for project #${p.id}`,
      );
    }

    // آمار: اگه همه null بودن، کل stats رو null کن
    const hasAnyStat =
      p.statsStars !== null ||
      p.statsForks !== null ||
      p.statsViews !== null ||
      p.statsUsers !== null;

    return {
      id: p.id,
      title: t.title,
      description: t.description,
      longDescription: t.longDescription,
      category: p.category,
      tags: t.tags ?? [],
      image: p.image,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      techStack: p.techStack ?? [],
      features: t.features ?? [],
      date: p.date,
      stats: hasAnyStat
        ? {
            stars: p.statsStars,
            forks: p.statsForks,
            views: p.statsViews,
            users: p.statsUsers,
          }
        : null,
      status: p.status,
      featured: p.featured,
      order: p.order,
    };
  }

  private validateInput(projects: ProjectDto[]): void {
    for (const p of projects) {
      this.validateLanguages(
        p.translations.map((t) => t.language),
        `project with title "${p.translations[0]?.title ?? 'unknown'}"`,
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
