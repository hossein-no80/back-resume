import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { BlogCategory } from '../enums/blog-category.enum';
import { BlogTranslationDto } from './blog-translation.dto';
import { IsUrlOrPath } from '../../../common/validators/is-url-or-path.validator';

const emptyToUndefined = ({ value }: TransformFnParams): unknown => {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

export class BlogPostDto {
  @ApiProperty({
    example: 'securing-nextjs-application-guide',
    maxLength: 200,
    description: 'slug (باید یکتا باشه)',
  })
  @IsString()
  @Length(1, 200)
  slug: string;

  @ApiProperty({
    enum: BlogCategory,
    example: BlogCategory.SECURITY,
  })
  @IsEnum(BlogCategory)
  category: BlogCategory;

  @ApiProperty({
    example: 'John Doe',
    maxLength: 100,
    description: 'اسم نویسنده',
  })
  @IsString()
  @Length(1, 100)
  authorName: string;

  @ApiPropertyOptional({
    example: '/uploads/authors/john.png',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  authorAvatar?: string;

  @ApiProperty({
    example: '2025-03-15',
    maxLength: 50,
    description: 'تاریخ انتشار',
  })
  @IsString()
  @Length(1, 50)
  date: string;

  @ApiProperty({
    example: 12,
    minimum: 1,
    description: 'زمان مطالعه (دقیقه)',
  })
  @IsInt()
  @Min(1)
  readTime: number;

  @ApiPropertyOptional({
    example: '/blog/security-nextjs.jpg',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  coverImage?: string;

  // ─── Stats (اختیاری) ───
  @ApiPropertyOptional({ example: 2847, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  statsViews?: number;

  @ApiPropertyOptional({ example: 342, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  statsLikes?: number;

  @ApiPropertyOptional({ example: 28, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  statsComments?: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  featured: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  published: boolean;

  @ApiProperty({ example: 0, description: 'ترتیب نمایش' })
  @IsInt()
  @Min(0)
  order: number;

  @ApiProperty({ type: [BlogTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BlogTranslationDto)
  translations: BlogTranslationDto[];
}
