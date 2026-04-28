import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../../common/constants';

export class CreateSkillTranslationDto {
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsIn(['advanced', 'Beginner', 'Intermediate'])
  level: string;

  @IsNotEmpty()
  @IsString()
  icon?: string;
}
