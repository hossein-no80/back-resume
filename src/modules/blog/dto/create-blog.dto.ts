import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
  IsEnum,
  ArrayMinSize,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBlogTranslationDto } from './create-blog-translation.dto';
import { BlogStatus } from '../entities/blog-status.enum';
import { CreateBlogImageDto } from './create-blog-image.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBlogTranslationDto)
  @ArrayMinSize(1)
  @ApiProperty({
    type: [CreateBlogTranslationDto],
    description: 'لیست ترجمه‌های بلاگ (حداقل یک آیتم)',
    example: [
      {
        language: 'fa',
        title: 'عنوان فارسی',
        content: 'مطلب به فارسی',
        subtitle: 'زیرنویس',
        excerpt: 'خلاصه',
      },
    ],
  })
  @ArrayMinSize(1)
  translations: CreateBlogTranslationDto[];

  @IsOptional()
  @IsEnum(BlogStatus)
  @ApiPropertyOptional({ enum: BlogStatus, default: BlogStatus.DRAFT })
  status?: BlogStatus;

  @ApiPropertyOptional({ type: [CreateBlogImageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBlogImageDto)
  images?: CreateBlogImageDto[];

  @ValidateIf((o) => o.authorId !== undefined && o.authorId !== null)
  @IsUUID()
  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    description: 'شناسه نویسنده',
  })
  authorId?: string | null;

  @ValidateIf((o) => o.tagIds !== null && o.tagIds !== undefined)
  @IsArray()
  @IsUUID('4', { each: true })
  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'آرایه شناسه تگ‌ها',
  })
  tagIds?: string[] | null;

  @IsOptional()
  @ApiPropertyOptional({ type: Date, description: 'تاریخ انتشار' })
  publishedAt?: Date;
}
