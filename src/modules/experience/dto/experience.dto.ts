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
import { ExperienceType } from '../enums/experience-type.enum';
import { ExperienceTranslationDto } from './experience-translation.dto';
import { IsUrlOrPath } from '../../../common/validators/is-url-or-path.validator';

const emptyToUndefined = ({ value }: TransformFnParams): unknown => {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

export class ExperienceDto {
  @ApiProperty({
    example: 'TechCorp Inc.',
    maxLength: 150,
  })
  @IsString()
  @Length(1, 150)
  company: string;

  @ApiPropertyOptional({
    example: '/uploads/techcorp.png',
    description: 'لوگوی شرکت (اختیاری)',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  companyLogo?: string;

  @ApiProperty({
    example: 'Jan 2024',
    maxLength: 50,
    description: 'تاریخ شروع (متن آزاد)',
  })
  @IsString()
  @Length(1, 50)
  startDate: string;

  @ApiPropertyOptional({
    example: 'Dec 2023',
    maxLength: 50,
    description: 'تاریخ پایان — اگه نفرستی یا null بدی یعنی «تا کنون»',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Length(0, 50)
  endDate?: string;

  @ApiProperty({
    enum: ExperienceType,
    example: ExperienceType.FULL_TIME,
  })
  @IsEnum(ExperienceType)
  type: ExperienceType;

  @ApiPropertyOptional({
    example: 'https://techcorp.com',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  website?: string;

  @ApiProperty({
    example: true,
    description: 'نمایش بزرگ‌تر تو فرانت',
  })
  @IsBoolean()
  featured: boolean;

  @ApiProperty({ example: 0, description: 'ترتیب نمایش' })
  @IsInt()
  @Min(0)
  order: number;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['Next.js', 'TypeScript', 'Node.js'],
    description: 'اسم تکنولوژی‌ها (بدون ترجمه)',
  })
  @IsArray()
  @IsString({ each: true })
  @Length(1, 100, { each: true })
  technologies: string[];

  @ApiProperty({ type: [ExperienceTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ExperienceTranslationDto)
  translations: ExperienceTranslationDto[];
}
