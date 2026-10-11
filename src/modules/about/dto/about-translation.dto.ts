import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, TransformFnParams } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../common/constants';

const emptyToUndefined = ({ value }: TransformFnParams): unknown => {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

// ============ Sub-DTOs برای jsonb ============

export class AboutSectionDataDto {
  @ApiProperty({ example: 'sec-1' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Code2', description: 'نام آیکون Lucide' })
  @IsString()
  @Length(1, 50)
  icon: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  order: number;

  @ApiProperty({ example: 'پیشینه من' })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({ example: 'من یک مهندس نرم‌افزار...' })
  @IsString()
  @Length(1, 5000)
  content: string;
}

export class AboutExpertiseDataDto {
  @ApiProperty({ example: 'exp-1' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Code2', description: 'نام آیکون Lucide' })
  @IsString()
  @Length(1, 50)
  icon: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  order: number;

  @ApiProperty({ example: 'مهندسی' })
  @IsString()
  @Length(1, 100)
  title: string;

  @ApiProperty({ example: 'ساخت نرم‌افزار مدرن.' })
  @IsString()
  @Length(1, 300)
  description: string;
}

// ============ DTO اصلی ============

export class AboutTranslationDto {
  @ApiProperty({
    example: 'fa',
    enum: SUPPORTED_LANGUAGES,
    description: 'کد زبان',
  })
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @ApiProperty({ example: 'حسین رضایی', maxLength: 100 })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: 'مهندس نرم‌افزار · امنیت', maxLength: 200 })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiPropertyOptional({
    example: 'Engineering systems. Understanding how they work.',
    maxLength: 500,
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Length(0, 500)
  heading?: string;

  @ApiProperty({ example: 'من یک مهندس نرم‌افزار هستم...' })
  @IsString()
  @Length(1, 5000)
  bio: string;

  @ApiPropertyOptional({ example: 'تهران، ایران', maxLength: 200 })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Length(0, 200)
  location?: string;

  @ApiPropertyOptional({
    type: [AboutSectionDataDto],
    description: 'بخش‌های درباره من (به این زبان)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AboutSectionDataDto)
  aboutSections?: AboutSectionDataDto[];

  @ApiPropertyOptional({
    type: [AboutExpertiseDataDto],
    description: 'کارت‌های تخصص (به این زبان)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AboutExpertiseDataDto)
  expertise?: AboutExpertiseDataDto[];
}
