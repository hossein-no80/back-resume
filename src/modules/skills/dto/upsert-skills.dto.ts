import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { SkillCategoryDto } from './skill-category.dto';

export class UpsertSkillsDto {
  @ApiProperty({
    type: [SkillCategoryDto],
    description: 'آرایه کامل دسته‌بندی‌ها (جایگزین کل داده قبلی می‌شه)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SkillCategoryDto)
  categories: SkillCategoryDto[];
}

/**
 * برای PATCH:
 * - همه فیلدها optional می‌شن
 * - اگه `categories` بفرستی → کل داده جایگزین می‌شه
 * - اگه نفرستی → هیچی تغییر نمی‌کنه
 */
export class UpdateSkillsDto extends PartialType(UpsertSkillsDto) {}
