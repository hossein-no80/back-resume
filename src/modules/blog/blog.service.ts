import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { BlogTranslation } from './entities/blog-translation.entity';
import { BlogImage } from './entities/blog-image.entity';
import { Author } from './entities/author.entity';
import { Tag } from './entities/tag.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { DEFAULT_LANGUAGE } from '../../common/constants';
import { BlogStatus } from './entities/blog-status.enum';
import slugify from 'slugify';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    @InjectRepository(Blog)
    private blogRepo: Repository<Blog>,
    @InjectRepository(BlogTranslation)
    private translationRepo: Repository<BlogTranslation>,
    @InjectRepository(BlogImage)
    private imageRepo: Repository<BlogImage>,
    @InjectRepository(Author)
    private authorRepo: Repository<Author>,
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
    private dataSource: DataSource,
  ) {}

  private async getBlogEntity(id: string, withUnpublished = false): Promise<Blog> {
    const where: any = { id };
    if (!withUnpublished) {
      where.status = BlogStatus.PUBLISHED;
    }
    const blog = await this.blogRepo.findOne({
      where,
      relations: ['translations', 'author', 'tags', 'comments', 'images'],
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  private getTranslatedBlog(blog: Blog, language: string) {
    const translation = blog.translations?.find((t) => t.language === language);
    if (!translation) {
      const fallback = blog.translations?.[0];
      if (!fallback) throw new NotFoundException('No translation found');
      return {
        id: blog.id,
        slug: blog.slug,
        status: blog.status,
        publishedAt: blog.publishedAt,
        author: blog.author,
        tags: blog.tags,
        comments: blog.comments,
        images: blog.images,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        title: fallback.title,
        subtitle: fallback.subtitle,
        excerpt: fallback.excerpt,
        content: fallback.content,
      };
    }
    return {
      id: blog.id,
      slug: blog.slug,
      status: blog.status,
      publishedAt: blog.publishedAt,
      author: blog.author,
      tags: blog.tags,
      comments: blog.comments,
      images: blog.images,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      title: translation.title,
      subtitle: translation.subtitle,
      excerpt: translation.excerpt,
      content: translation.content,
    };
  }

  private generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, locale: 'en' }) + '-' + Date.now().toString(36);
  }

  async create(createDto: CreateBlogDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const primaryTranslation = createDto.translations[0];
      const slug = this.generateSlug(primaryTranslation.title);

      const blog = queryRunner.manager.create(Blog, {
        slug,
        status: createDto.status ?? BlogStatus.DRAFT,
        publishedAt: createDto.publishedAt,
      });
      await queryRunner.manager.save(blog);

      // ترجمه‌ها
      if (createDto.translations?.length) {
        const translations = createDto.translations.map((t) =>
          queryRunner.manager.create(BlogTranslation, { ...t, blog }),
        );
        await queryRunner.manager.save(translations);
      }

      // نویسنده
      if (createDto.authorId) {
        const author = await this.authorRepo.findOne({ where: { id: createDto.authorId } });
        if (!author) throw new NotFoundException('Author not found');
        blog.author = author;
      } else {
        blog.author = null; // اختیاری، پیش‌فرض null است
      }
      await queryRunner.manager.save(blog);

      // برچسب‌ها
      if (createDto.tagIds?.length) {
        const tags = await this.tagRepo.findBy({ id: In(createDto.tagIds) });
        if (tags.length !== createDto.tagIds.length) {
          throw new NotFoundException('Some tag IDs are invalid');
        }
        blog.tags = tags;
        await queryRunner.manager.save(blog);
      }

      // تصاویر
      if (createDto.images?.length) {
        const images = createDto.images.map((img) =>
          queryRunner.manager.create(BlogImage, { ...img, blog }),
        );
        await queryRunner.manager.save(images);
      }

      await queryRunner.commitTransaction();
      return this.findOne(blog.id, DEFAULT_LANGUAGE, true);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error creating blog', error.stack);
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(language: string = DEFAULT_LANGUAGE, includeAll = false) {
    const whereCondition = includeAll ? {} : { status: BlogStatus.PUBLISHED };
    const blogs = await this.blogRepo.find({
      where: whereCondition,
      relations: ['translations', 'author', 'tags', 'comments', 'images'],
      order: { createdAt: 'DESC' },
    });
    return blogs.map((b) => this.getTranslatedBlog(b, language));
  }

  async findOne(
    id: string,
    language: string = DEFAULT_LANGUAGE,
    allowUnpublished = false) {
    const blog = await this.getBlogEntity(id, allowUnpublished);
    return this.getTranslatedBlog(blog, language);
  }

  async update(id: string, updateDto: UpdateBlogDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const blog = await queryRunner.manager.findOne(Blog, {
        where: { id },
        relations: ['translations', 'tags', 'author', 'images'],
      });
      if (!blog) throw new NotFoundException('Blog not found');

      // فیلدهای ساده
      if (updateDto.status !== undefined) blog.status = updateDto.status;
      if (updateDto.publishedAt !== undefined) blog.publishedAt = updateDto.publishedAt;

      // به‌روزرسانی slug در صورت تغییر عنوان اولین ترجمه
      if (updateDto.translations?.length) {
        const firstTrans = updateDto.translations[0];
        if (firstTrans.title) {
          blog.slug = this.generateSlug(firstTrans.title);
        }
      }
      await queryRunner.manager.save(blog);

      // ترجمه‌ها
      if (updateDto.translations && updateDto.translations.length > 0) {
        await queryRunner.manager.delete(BlogTranslation, { blog: { id } });
        const newTranslations = updateDto.translations.map((t) =>
          queryRunner.manager.create(BlogTranslation, { ...t, blog }),
        );
        await queryRunner.manager.save(newTranslations);
      }

      // نویسنده
      if ('authorId' in updateDto) {
        if (updateDto.authorId === null) {
          blog.author = null;
        } else {
          const author = await this.authorRepo.findOne({ where: { id: updateDto.authorId } });
          if (!author) throw new NotFoundException('Author not found');
          blog.author = author;
        }
        await queryRunner.manager.save(blog);
      }

      if ('tagIds' in updateDto) {
        if (updateDto.tagIds === null || (Array.isArray(updateDto.tagIds) && updateDto.tagIds.length === 0)) {
          // حذف تمام برچسب‌ها
          blog.tags = [];
        } else if (Array.isArray(updateDto.tagIds)) {
          const tags = await this.tagRepo.findBy({ id: In(updateDto.tagIds) });
          if (tags.length !== updateDto.tagIds.length) {
            throw new NotFoundException('Some tag IDs are invalid');
          }
          blog.tags = tags;
        }
        await queryRunner.manager.save(blog);
      }

      // تصاویر (جایگزینی کامل)
      if (updateDto.images) {
        await queryRunner.manager.delete(BlogImage, { blog: { id } });
        const newImages = updateDto.images.map((img) =>
          queryRunner.manager.create(BlogImage, { ...img, blog }),
        );
        await queryRunner.manager.save(newImages);
      }

      await queryRunner.commitTransaction();
      return this.findOne(id, DEFAULT_LANGUAGE, true);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error updating blog ${id}`, error.stack);
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const blog = await this.getBlogEntity(id, true);
    await this.blogRepo.remove(blog);
    return { message: 'Blog deleted successfully' };
  }
}