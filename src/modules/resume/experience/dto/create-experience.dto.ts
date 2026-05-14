import { IsArray, ValidateNested, IsString, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExperienceTranslationDto } from './create-experience-translation.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExperienceDto {
  @ApiProperty({ example: 'شرکت فناوری برتر' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiPropertyOptional({ example: 'تهران' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: '2022-01-01' })
  @IsDateString()
  startDate: Date;

  @ApiPropertyOptional({ example: '2023-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ type: [CreateExperienceTranslationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExperienceTranslationDto)
  translations: CreateExperienceTranslationDto[];
}