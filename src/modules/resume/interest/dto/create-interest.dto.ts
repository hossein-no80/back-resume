import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInterestTranslationDto } from './create-interest-translation.dto';
export class CreateInterestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInterestTranslationDto)
  translations: CreateInterestTranslationDto[];
}
