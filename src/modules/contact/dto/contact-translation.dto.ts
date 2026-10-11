import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../../common/constants';
import { WorkingHourDto } from './working-hour.dto';

const emptyToUndefined = ({ value }: TransformFnParams): unknown => {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

export class ContactTranslationDto {
  @ApiProperty({
    example: 'fa',
    enum: SUPPORTED_LANGUAGES,
    description: 'کد زبان',
  })
  @IsString()
  @IsIn(SUPPORTED_LANGUAGES)
  language: string;

  @ApiPropertyOptional({
    example: 'تهران، خیابان آزادی، پلاک ۱۲',
    maxLength: 500,
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Length(0, 500)
  address?: string;

  @ApiProperty({
    type: [WorkingHourDto],
    example: [
      { day: 'دوشنبه تا جمعه', hours: '۹:۰۰ تا ۱۸:۰۰' },
      { day: 'شنبه', hours: '۱۰:۰۰ تا ۱۶:۰۰' },
      { day: 'یکشنبه', hours: 'تعطیل' },
    ],
    description: 'ساعات کاری',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHourDto)
  workingHours: WorkingHourDto[];
}
