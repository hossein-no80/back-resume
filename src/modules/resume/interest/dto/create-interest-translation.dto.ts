import { IsString, IsIn, Length, IsOptional } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../../common/constants';

export class CreateInterestTranslationDto {
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @IsString()
  @Length(1, 200)
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  category?: string;
}
