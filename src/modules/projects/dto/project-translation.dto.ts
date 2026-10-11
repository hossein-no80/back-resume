import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../common/constants';

const emptyToUndefined = ({ value }: TransformFnParams): unknown => {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

export class ProjectTranslationDto {
  @ApiProperty({
    example: 'fa',
    enum: SUPPORTED_LANGUAGES,
    description: 'کد زبان',
  })
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @ApiProperty({
    example: 'سیستم احراز هویت امن',
    maxLength: 200,
  })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({
    example: 'سیستم احراز هویت سازمانی با ویژگی‌های امنیتی پیشرفته',
    maxLength: 1000,
  })
  @IsString()
  @Length(1, 1000)
  description: string;

  @ApiPropertyOptional({
    example: 'یک سیستم جامع احراز هویت و مجوزدهی...',
    maxLength: 5000,
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Length(0, 5000)
  longDescription?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['احراز هویت', 'امنیت', 'سازمانی'],
    description: 'برچسب‌های پروژه',
  })
  @IsArray()
  @IsString({ each: true })
  @Length(1, 100, { each: true })
  tags: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['احراز هویت چندعاملی (MFA)', 'ادغام OAuth 2.0'],
    description: 'ویژگی‌های کلیدی پروژه',
  })
  @IsArray()
  @IsString({ each: true })
  @Length(1, 500, { each: true })
  features: string[];
}
