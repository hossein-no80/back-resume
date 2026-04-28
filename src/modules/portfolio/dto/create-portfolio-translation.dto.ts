import { IsString, IsIn, Length, IsOptional } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../common/constants';

export class CreatePortfolioTranslationDto {
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @IsString()
  @Length(1, 200)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  subtitle?: string;

  @IsString()
  description: string;
}