import { IsString, IsIn, Length, IsOptional } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../common/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogTranslationDto {
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  @ApiProperty({ example: 'fa', description: 'کد زبان (fa, en, ...)' })
  language: string;

  @IsString()
  @Length(1, 200)
  @ApiProperty({ example: 'راهنمای NestJS', maxLength: 200 })
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  @ApiPropertyOptional({ example: 'زیرنویس جذاب', maxLength: 200 })
  subtitle?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'خلاصه مطلب ...' })
  excerpt?: string;

  @IsString()
  @ApiProperty({ example: '<p>متن کامل مطلب</p>' })
  content: string;
}
