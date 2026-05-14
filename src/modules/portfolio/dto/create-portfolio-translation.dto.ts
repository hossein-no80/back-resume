import { IsString, IsIn, Length, IsOptional } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../common/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePortfolioTranslationDto {
  @ApiProperty({
    example: 'fa',
    description: 'کد زبان (fa, en, fr, de, es, ar)',
  })
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @ApiProperty({ example: 'فروشگاه آنلاین', maxLength: 200 })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiPropertyOptional({ example: 'پروژه اختصاصی فروشگاهی', maxLength: 200 })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  subtitle?: string;

  @ApiProperty({
    example: 'این پروژه با استفاده از React و Node.js ساخته شده است...',
  })
  @IsString()
  description: string;
}
