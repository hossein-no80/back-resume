import { IsString, IsIn, Length } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../../common/constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAboutTranslationDto {
  @ApiProperty({ example: 'fa', description: 'کد زبان (fa, en, ...)' })
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @ApiProperty({ example: 'درباره من', maxLength: 200 })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({ example: 'من یک توسعه‌دهنده فول‌استک هستم...' })
  @IsString()
  description: string;
}
