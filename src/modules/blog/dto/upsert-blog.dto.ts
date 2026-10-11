import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { BlogPostDto } from './blog-post.dto';

export class UpsertBlogDto {
  @ApiProperty({
    type: [BlogPostDto],
    description: 'آرایه کامل پست‌ها (جایگزین کل داده قبلی می‌شه)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BlogPostDto)
  posts: BlogPostDto[];
}

/**
 * برای PATCH:
 * - همه فیلدها optional می‌شن
 * - اگه `posts` بفرستی → کل داده جایگزین می‌شه
 */
export class UpdateBlogDto extends PartialType(UpsertBlogDto) {}
