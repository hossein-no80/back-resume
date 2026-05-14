import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsUrl,
  IsDateString,
  ArrayMinSize,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePortfolioTranslationDto } from './create-portfolio-translation.dto';
import { CreatePortfolioImageDto } from './create-portfolio-image.dto';
import { PortfolioStatus } from '../entities/portfolio-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePortfolioDto {
  @ApiProperty({
    type: [CreatePortfolioTranslationDto],
    description: 'لیست ترجمه‌های پروژه (حداقل یک آیتم)',
    example: [
      {
        language: 'fa',
        title: 'فروشگاه آنلاین',
        description: 'توضیحات پروژه',
        subtitle: 'پروژه تیمی',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePortfolioTranslationDto)
  @ArrayMinSize(1)
  translations: CreatePortfolioTranslationDto[];

  @ApiPropertyOptional({ example: 'https://github.com/username/project' })
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsEnum(PortfolioStatus)
  status?: PortfolioStatus;

  @ApiPropertyOptional({ example: 'https://demo.project.com' })
  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  projectDate?: Date;

  @ApiPropertyOptional({
    type: [Number],
    example: [1, 2, 3],
    description: 'شناسه‌های مهارت‌های استفاده شده',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  skillIds?: number[];

  @ApiPropertyOptional({ type: [CreatePortfolioImageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePortfolioImageDto)
  images?: CreatePortfolioImageDto[];
}
