import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { SkillCategoryTranslationDto } from './skill-translation.dto';
import { SkillItemDto } from './skill-item.dto';

export class SkillCategoryDto {
  @ApiProperty({
    example: 'engineering',
    maxLength: 50,
    description: 'کلید یکتا (frontend از این برای map کردن استایل استفاده می‌کنه)',
  })
  @IsString()
  @Length(1, 50)
  key: string;

  @ApiProperty({
    example: 'Code2',
    maxLength: 50,
    description: 'نام آیکون Lucide',
  })
  @IsString()
  @Length(1, 50)
  icon: string;

  @ApiProperty({ example: 0, description: 'ترتیب نمایش دسته' })
  @IsInt()
  @Min(0)
  order: number;

  @ApiProperty({ type: [SkillCategoryTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SkillCategoryTranslationDto)
  translations: SkillCategoryTranslationDto[];

  @ApiProperty({ type: [SkillItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillItemDto)
  skills: SkillItemDto[];
}
