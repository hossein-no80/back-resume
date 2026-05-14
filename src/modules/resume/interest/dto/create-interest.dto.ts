import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInterestTranslationDto } from './create-interest-translation.dto';
import { ApiProperty } from '@nestjs/swagger';
export class CreateInterestDto {
  @ApiProperty({ type: [CreateInterestTranslationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInterestTranslationDto)
  translations: CreateInterestTranslationDto[];
}
