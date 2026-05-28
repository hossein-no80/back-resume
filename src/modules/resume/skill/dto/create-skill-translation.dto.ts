import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../../common/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSkillTranslationDto {
  @ApiProperty({ example: 'fa', description: 'کد زبان (fa, en, ...)' })
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @ApiProperty({ example: 'nextjs', maxLength: 200 })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Intermediate', maxLength: 20 })
  @IsIn(['Advanced', 'Beginner', 'Intermediate'])
  level: string;

  @ApiPropertyOptional({ example: 'asdfj;alskfjasdl;fj' })
  @IsNotEmpty()
  @IsString()
  icon?: string;
}
