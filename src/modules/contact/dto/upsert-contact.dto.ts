import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { IsUrlOrPath } from '../../../common/validators/is-url-or-path.validator';
import { ContactTranslationDto } from './contact-translation.dto';

const emptyToUndefined = ({ value }: TransformFnParams): unknown => {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
};

export class UpsertContactDto {
  @ApiPropertyOptional({
    example: 'PST (UTC-8)',
    maxLength: 50,
    description: 'منطقه زمانی',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Length(0, 50)
  timezone?: string;

  @ApiPropertyOptional({
    example: '021-12345678',
    maxLength: 50,
    description: 'تلفن ثابت',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @Length(0, 50)
  landlinePhone?: string;

  @ApiPropertyOptional({
    example: 'https://instagram.com/username',
    description: 'آدرس اینستاگرام',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  instagramUrl?: string;

  @ApiPropertyOptional({
    example: 'https://t.me/username',
    description: 'آدرس تلگرام',
  })
  @Transform(emptyToUndefined)
  @IsOptional()
  @IsString()
  @IsUrlOrPath()
  telegramUrl?: string;

  @ApiProperty({
    type: [ContactTranslationDto],
    description: 'ترجمه‌ها (حداقل یکی)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ContactTranslationDto)
  translations: ContactTranslationDto[];
}

/**
 * برای PATCH:
 * - همه فیلدها optional می‌شن
 * - اگه `translations` بفرستی → کل ترجمه‌ها جایگزین می‌شن
 */
export class UpdateContactDto extends PartialType(UpsertContactDto) {}
