import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../common/constants';
import { BlogSectionDto } from './blog-section.dto';

const emptyToUndefined = ({ value }: TransformFnParams): unknown => {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

export class BlogTranslationDto {
  @ApiProperty({
    example: 'fa',
    enum: SUPPORTED_LANGUAGES,
    description: 'کد زبان',
  })
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @ApiProperty({
    example: 'راهنمای جامع امن‌سازی اپلیکیشن Next.js',
    maxLength: 200,
  })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({
    example: 'یادگیری روش‌های امنیتی ضروری...',
    maxLength: 1000,
  })
  @IsString()
  @Length(1, 1000)
  excerpt: string;

  @ApiPropertyOptional({
    example: 'در این مقاله درباره امن‌سازی...',
    maxLength: 5000,
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Length(0, 5000)
  intro?: string;

  @ApiPropertyOptional({
    example: 'مهندس امنیت ارشد',
    maxLength: 100,
    description: 'سمت نویسنده (ترجمه‌شدنی)',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Length(0, 100)
  authorRole?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['Next.js', 'امنیت', 'OWASP'],
    description: 'برچسب‌ها',
  })
  @IsArray()
  @IsString({ each: true })
  @Length(1, 100, { each: true })
  tags: string[];

  @ApiProperty({
    type: [BlogSectionDto],
    description: 'بخش‌های مقاله',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogSectionDto)
  sections: BlogSectionDto[];
}
