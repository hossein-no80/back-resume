import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type, TransformFnParams } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AboutTranslationDto } from './about-translation.dto';
import { IsUrlOrPath } from '../../../common/validators/is-url-or-path.validator';

const emptyToUndefined = ({ value }: TransformFnParams): unknown => {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

export class SocialLinksDto {
  @ApiPropertyOptional({ example: 'https://github.com/johndoe' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  github?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/johndoe' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  linkedin?: string;

  @ApiPropertyOptional({ example: 'https://twitter.com/johndoe' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  twitter?: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/@johndoe' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  youtube?: string;

  @ApiPropertyOptional({ example: 'https://johndoe.dev' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  website?: string;
}

export class UpsertAboutDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+1 (555) 123-4567' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '/uploads/avatar.jpg' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  avatar?: string;

  @ApiPropertyOptional({ example: '/uploads/resume.pdf' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  resumeUrl?: string;

  @ApiPropertyOptional({ example: 'John_Doe_Resume.pdf' })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  resumeFileName?: string;

  @ApiProperty({ type: SocialLinksDto })
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks: SocialLinksDto;

  @ApiProperty({ example: true })
  @IsBoolean()
  available: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  openToWork: boolean;

  @ApiProperty({ type: [AboutTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AboutTranslationDto)
  translations: AboutTranslationDto[];
}

/**
 * برای PATCH:
 * - همه فیلدها optional می‌شن
 * - فقط فیلدهای ارسالی آپدیت می‌شن
 */
export class UpdateAboutDto extends PartialType(UpsertAboutDto) {}
