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

export class CreateAboutDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl()
  profilePicture?: string | null;

  @IsOptional()
  @IsUrl()
  proficientUser?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAboutTranslationDto)
  translations: CreateAboutTranslationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExperienceDto)
  experiences?: CreateExperienceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInterestDto)
  interests?: CreateInterestDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillDto)
  skills?: CreateSkillDto[];
}
