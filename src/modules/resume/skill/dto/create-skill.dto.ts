import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSkillTranslationDto } from './create-skill-translation.dto';

export class CreateSkillDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillTranslationDto)
  translations: CreateSkillTranslationDto[];
}
