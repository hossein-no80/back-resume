import { IsString, IsIn, Length } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../../common/constants';

export class CreateAboutTranslationDto {
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @IsString()
  @Length(1, 200)
  title: string;

  @IsString()
  description: string;
}
