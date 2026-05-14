import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSkillTranslationDto } from './create-skill-translation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({ type: [CreateSkillTranslationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillTranslationDto)
  translations: CreateSkillTranslationDto[];
}
