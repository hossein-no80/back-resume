import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { ExperienceDto } from './experience.dto';

export class UpsertExperienceDto {
  @ApiProperty({
    type: [ExperienceDto],
    description: 'آرایه کامل تجربه‌ها (جایگزین کل داده قبلی می‌شه)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experiences: ExperienceDto[];
}

/**
 * برای PATCH:
 * - همه فیلدها optional می‌شن
 * - اگه `experiences` بفرستی → کل داده جایگزین می‌شه
 */
export class UpdateExperienceDto extends PartialType(UpsertExperienceDto) {}
