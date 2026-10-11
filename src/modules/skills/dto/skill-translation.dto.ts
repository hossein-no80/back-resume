import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsIn, IsOptional, IsString, Length } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../common/constants';

const emptyToUndefined = ({ value }: TransformFnParams): unknown => {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

// ─── Category Translation ───
export class SkillCategoryTranslationDto {
  @ApiProperty({
    example: 'fa',
    enum: SUPPORTED_LANGUAGES,
    description: 'کد زبان',
  })
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @ApiProperty({ example: 'مهندسی', maxLength: 100 })
  @IsString()
  @Length(1, 100)
  title: string;

  @ApiProperty({ example: 'مهارت‌های اصلی مهندسی نرم‌افزار' })
  @IsString()
  @Length(1, 1000)
  description: string;
}

// ─── Item Translation ───
export class SkillItemTranslationDto {
  @ApiProperty({
    example: 'fa',
    enum: SUPPORTED_LANGUAGES,
    description: 'کد زبان',
  })
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @ApiProperty({
    example: 'TypeScript / JavaScript',
    maxLength: 100,
    description: 'اسم مهارت (معمولاً انگلیسی می‌مونه)',
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    example: 'متخصص در توسعه مدرن JS/TS',
    maxLength: 500,
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;
}
