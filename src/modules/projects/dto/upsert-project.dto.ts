import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { ProjectDto } from './project.dto';

export class UpsertProjectsDto {
  @ApiProperty({
    type: [ProjectDto],
    description: 'آرایه کامل پروژه‌ها (جایگزین کل داده قبلی می‌شه)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  projects: ProjectDto[];
}

/**
 * برای PATCH:
 * - همه فیلدها optional می‌شن
 * - اگه `projects` بفرستی → کل داده جایگزین می‌شه
 */
export class UpdateProjectsDto extends PartialType(UpsertProjectsDto) {}
