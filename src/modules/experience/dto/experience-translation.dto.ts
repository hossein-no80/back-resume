import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../common/constants';

const emptyToUndefined = ({ value }: TransformFnParams): unknown => {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

export class ExperienceTranslationDto {
  @ApiProperty({
    example: 'fa',
    enum: SUPPORTED_LANGUAGES,
    description: 'کد زبان',
  })
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @ApiProperty({
    example: 'توسعه‌دهنده ارشد فول‌استک',
    maxLength: 150,
  })
  @IsString()
  @Length(1, 150)
  position: string;

  @ApiProperty({
    example: 'سان‌فرانسیسکو (دورکاری)',
    maxLength: 150,
  })
  @IsString()
  @Length(1, 150)
  location: string;

  @ApiPropertyOptional({
    example: 'فین‌تک',
    maxLength: 100,
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Length(0, 100)
  industry?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['رهبری توسعه پلتفرم معاملاتی...', 'طراحی معماری میکروسرویس...'],
    description: 'آرایه پاراگراف‌ها',
  })
  @IsArray()
  @IsString({ each: true })
  @Length(1, 2000, { each: true })
  description: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['کاهش ۴۵٪ زمان پاسخ API', 'مهاجرت با صفر downtime'],
    description: 'آرایه دستاوردها (bullets)',
  })
  @IsArray()
  @IsString({ each: true })
  @Length(1, 1000, { each: true })
  achievements: string[];
}
