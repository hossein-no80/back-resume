import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../../common/constants';

export class HeroTranslationDto {
  @ApiProperty({ example: 'en', enum: SUPPORTED_LANGUAGES })
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @ApiProperty({ example: 'Building reliable software.' })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({ example: 'Thinking like an attacker.' })
  @IsString()
  @Length(1, 200)
  subtitle: string;

  @ApiProperty({ example: 'I design and build modern web applications...' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'View my work' })
  @IsString()
  @Length(1, 100)
  cta1: string;

  @ApiProperty({ example: 'Explore asdf' })
  @IsString()
  @Length(1, 100)
  cta2: string;

  @ApiProperty({ example: 'Available for new opportunities' })
  @IsString()
  @Length(1, 200)
  status: string;

  @ApiProperty({ example: 'Software Engineer · Security' })
  @IsString()
  @Length(1, 200)
  role: string;
}

export class UpsertHeroDto {
  @ApiProperty({ type: [HeroTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => HeroTranslationDto)
  translations: HeroTranslationDto[];
}