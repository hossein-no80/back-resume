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
import { ProjectCategory, ProjectStatus } from '../enums/project.enums';
import { ProjectTranslationDto } from './project-translation.dto';
import { IsUrlOrPath } from '../../../common/validators/is-url-or-path.validator';

const emptyToUndefined = ({ value }: TransformFnParams): unknown => {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

export class ProjectDto {
  @ApiProperty({
    enum: ProjectCategory,
    example: ProjectCategory.SECURITY,
  })
  @IsEnum(ProjectCategory)
  category: ProjectCategory;

  @ApiPropertyOptional({
    example: '/uploads/project-cover.jpg',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  image?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/yourusername/secureauth-pro',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  githubUrl?: string;

  @ApiPropertyOptional({
    example: 'https://secureauth-pro.com',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  liveUrl?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['Next.js', 'TypeScript', 'Node.js'],
    description: 'تکنولوژی‌ها (بدون ترجمه)',
  })
  @IsArray()
  @IsString({ each: true })
  @Length(1, 100, { each: true })
  techStack: string[];

  @ApiProperty({
    example: '2025',
    maxLength: 50,
    description: 'تاریخ پروژه',
  })
  @IsString()
  @Length(1, 50)
  date: string;

  @ApiProperty({
    enum: ProjectStatus,
    example: ProjectStatus.ACTIVE,
  })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({
    example: true,
    description: 'نمایش به‌عنوان featured',
  })
  @IsBoolean()
  featured: boolean;

  @ApiProperty({ example: 0, description: 'ترتیب نمایش' })
  @IsInt()
  @Min(0)
  order: number;

  // ─── Stats (همه اختیاری) ───
  @ApiPropertyOptional({ example: 128 })
  @IsOptional()
  @IsInt()
  @Min(0)
  statsStars?: number;

  @ApiPropertyOptional({ example: 34 })
  @IsOptional()
  @IsInt()
  @Min(0)
  statsForks?: number;

  @ApiPropertyOptional({ example: 4200 })
  @IsOptional()
  @IsInt()
  @Min(0)
  statsViews?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  statsUsers?: number;

  @ApiProperty({ type: [ProjectTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProjectTranslationDto)
  translations: ProjectTranslationDto[];
}
