import { IsString, IsIn, Length, IsOptional } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../../common/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInterestTranslationDto {
  @ApiProperty({ example: 'fa', description: 'کد زبان (fa, en, ...)' })
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @ApiProperty({ example: 'فوتبال' })
  @IsString()
  @Length(1, 200)
  name: string;

  @ApiPropertyOptional({ example: 'فرانت اند' })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  category?: string;
}
