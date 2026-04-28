import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioTranslation } from './entities/portfolio-translation.entity';
import { PortfolioImage } from './entities/portfolio-image.entity';
import { Skill } from '../resume/skill/entities/skill.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { DEFAULT_LANGUAGE } from '../../common/constants';
import { PortfolioStatus } from './entities/portfolio-status.enum';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepo: Repository<Portfolio>,
    @InjectRepository(PortfolioTranslation)
    private translationRepo: Repository<PortfolioTranslation>,
    @InjectRepository(PortfolioImage)
    private imageRepo: Repository<PortfolioImage>,
    @InjectRepository(Skill)
    private skillRepo: Repository<Skill>,
    private dataSource: DataSource,
  ) {}

  private async getPortfolioEntity(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioRepo.findOne({
      where: { id },
      relations: ['translations', 'images', 'skillsUsed'],
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    return portfolio;
  }

  private getTranslatedPortfolio(portfolio: Portfolio, language: string) {
    const translation = portfolio.translations?.find((t) => t.language === language);
    if (!translation) {
      const fallback = portfolio.translations?.[0];
      if (!fallback) {
        throw new NotFoundException('No translation found for this portfolio');
      }
      return {
        id: portfolio.id,
        title: fallback.title,
        subtitle: fallback.subtitle,
        description: fallback.description,
        githubUrl: portfolio.githubUrl,
        demoUrl: portfolio.demoUrl,
        projectDate: portfolio.projectDate,
        skillsUsed: portfolio.skillsUsed,
        images: portfolio.images,
        createdAt: portfolio.createdAt,
        updatedAt: portfolio.updatedAt,
      };
    }
    return {
      id: portfolio.id,
      title: translation.title,
      subtitle: translation.subtitle,
      description: translation.description,
      githubUrl: portfolio.githubUrl,
      demoUrl: portfolio.demoUrl,
      projectDate: portfolio.projectDate,
      skillsUsed: portfolio.skillsUsed,
      images: portfolio.images,
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
    };
  }

  async create(createDto: CreatePortfolioDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create base portfolio
      const portfolio = queryRunner.manager.create(Portfolio, {
        githubUrl: createDto.githubUrl,
        demoUrl: createDto.demoUrl,
        projectDate: createDto.projectDate,
        status: createDto.status ?? PortfolioStatus.DRAFT,
      });
      await queryRunner.manager.save(portfolio);

      // 2. Add translations
      if (createDto.translations?.length) {
        const translations = createDto.translations.map((t) =>
          queryRunner.manager.create(PortfolioTranslation, {
            ...t,
            portfolio,   // only set the relation
          }),
        );
        await queryRunner.manager.save(translations);
      }

      // 3. Add skills (Many-to-Many)
      if (createDto.skillIds?.length) {
        const skills = await this.skillRepo.findBy({ id: In(createDto.skillIds) });
        if (skills.length !== createDto.skillIds.length) {
          throw new NotFoundException('Some skill IDs are invalid');
        }
        portfolio.skillsUsed = skills;
        await queryRunner.manager.save(portfolio);
      }

      // 4. Add images
      if (createDto.images?.length) {
        const images = createDto.images.map((img) =>
          queryRunner.manager.create(PortfolioImage, {
            ...img,
            portfolio,   // only set the relation
          }),
        );
        await queryRunner.manager.save(images);
      }

      await queryRunner.commitTransaction();
      return this.findOne(portfolio.id, DEFAULT_LANGUAGE, true);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error creating portfolio', error.stack);
      // Re-throw the actual error for debugging (remove in production)
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    language: string = DEFAULT_LANGUAGE,
    includeAll: boolean = false) {
    const whereCondition = includeAll
      ? {}
      : { status: PortfolioStatus.PUBLISHED };
    const portfolios = await this.portfolioRepo.find({
      where: whereCondition,
      relations: ['translations', 'images', 'skillsUsed'],
      order: { createdAt: 'DESC' },
    });
    return portfolios.map((p) => this.getTranslatedPortfolio(p, language));
  }

  async findOne(
    id: string,
    language: string = DEFAULT_LANGUAGE,
    allowUnpublished: boolean = false,
  ) {
    const portfolio = await this.getPortfolioEntity(id);
    if (!allowUnpublished && portfolio.status !== PortfolioStatus.PUBLISHED) {
      throw new NotFoundException('Portfolio not found');
    }
    return this.getTranslatedPortfolio(portfolio, language);
  }

  async update(id: string, updateDto: UpdatePortfolioDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Load existing portfolio with relations
      const portfolio = await queryRunner.manager.findOne(Portfolio, {
        where: { id },
        relations: ['translations', 'images', 'skillsUsed'],
      });
      if (!portfolio) throw new NotFoundException('Portfolio not found');
      if (updateDto.status !== undefined) portfolio.status = updateDto.status;

      // 2. Update scalar fields
      if (updateDto.githubUrl !== undefined) portfolio.githubUrl = updateDto.githubUrl;
      if (updateDto.demoUrl !== undefined) portfolio.demoUrl = updateDto.demoUrl;
      if (updateDto.projectDate !== undefined) portfolio.projectDate = updateDto.projectDate;
      await queryRunner.manager.save(portfolio);

      // 3. Replace translations
      if (updateDto.translations) {
        await queryRunner.manager.delete(PortfolioTranslation, { portfolio: { id } });
        const newTranslations = updateDto.translations.map((t) =>
          queryRunner.manager.create(PortfolioTranslation, {
            ...t,
            portfolio,
          }),
        );
        await queryRunner.manager.save(newTranslations);
      }

      // 4. Replace skills (Many-to-Many)
      if (updateDto.skillIds) {
        const skills = await this.skillRepo.findBy({ id: In(updateDto.skillIds) });
        if (skills.length !== updateDto.skillIds.length) {
          throw new NotFoundException('Some skill IDs are invalid');
        }
        portfolio.skillsUsed = skills;
        await queryRunner.manager.save(portfolio);
      }

      // 5. Replace images
      if (updateDto.images) {
        await queryRunner.manager.delete(PortfolioImage, { portfolio: { id } });
        const newImages = updateDto.images.map((img) =>
          queryRunner.manager.create(PortfolioImage, {
            ...img,
            portfolio,
          }),
        );
        await queryRunner.manager.save(newImages);
      }

      await queryRunner.commitTransaction();
      return this.findOne(id, DEFAULT_LANGUAGE, true);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error updating portfolio ${id}`, error.stack);
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const portfolio = await this.getPortfolioEntity(id);
    await this.portfolioRepo.remove(portfolio);
    return { message: 'Portfolio deleted successfully' };
  }
}