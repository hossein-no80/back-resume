import { IsArray, ValidateNested, IsString, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExperienceTranslationDto } from './create-experience-translation.dto';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExperienceTranslationDto)
  translations: CreateExperienceTranslationDto[];
}