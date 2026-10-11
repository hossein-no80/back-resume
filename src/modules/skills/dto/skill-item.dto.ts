import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { SkillItemTranslationDto } from './skill-translation.dto';

export class SkillItemDto {
  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 5,
    description: 'سطح مهارت (1-5)',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  level: number;

  @ApiPropertyOptional({ example: 5, description: 'سال تجربه (اختیاری)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  years?: number;

  @ApiProperty({ example: 0, description: 'ترتیب نمایش' })
  @IsInt()
  @Min(0)
  order: number;

  @ApiProperty({ type: [SkillItemTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SkillItemTranslationDto)
  translations: SkillItemTranslationDto[];
}
