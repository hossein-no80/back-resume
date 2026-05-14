// src/modules/about/dto/create-about.dto.ts
import {
  IsEmail,
  IsOptional,
  IsUrl,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAboutTranslationDto } from './create-about-translation.dto';
import { CreateExperienceDto } from '../../experience/dto/create-experience.dto';
import { CreateInterestDto } from '../../interest/dto/create-interest.dto';
import { CreateSkillDto } from '../../skill/dto/create-skill.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAboutDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'https://example.com/profile.jpg', nullable: true })
  @IsOptional()
  @IsUrl()
  profilePicture?: string | null;

  @ApiPropertyOptional({ example: 'https://github.com/username', nullable: true })
  @IsOptional()
  @IsUrl()
  proficientUser?: string | null;

  @ApiProperty({ type: [CreateAboutTranslationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAboutTranslationDto)
  translations: CreateAboutTranslationDto[];

  @ApiPropertyOptional({ type: [CreateExperienceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExperienceDto)
  experiences?: CreateExperienceDto[];

  @ApiPropertyOptional({ type: [CreateInterestDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInterestDto)
  interests?: CreateInterestDto[];

  @ApiPropertyOptional({ type: [CreateSkillDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillDto)
  skills?: CreateSkillDto[];
}
