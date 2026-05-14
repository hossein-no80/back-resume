import { IsString, IsIn, Length } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../../common/constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExperienceTranslationDto {
  @ApiProperty({ example: 'fa', description: 'کد زبان (fa, en, ...)' })
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @ApiProperty({ example: 'موضوع فرانت اند' })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({ example: 'موضوع فرانت اند' })
  @IsString()
  description: string;
}
