import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
  IsEnum,
  ArrayMinSize, ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBlogTranslationDto } from './create-blog-translation.dto';
import { BlogStatus } from '../entities/blog-status.enum';
import { CreateBlogImageDto } from './create-blog-image.dto';

export class CreateBlogDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBlogTranslationDto)
  @ArrayMinSize(1)
  translations: CreateBlogTranslationDto[];

  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBlogImageDto)
  images?: CreateBlogImageDto[];

  @ValidateIf((o) => o.authorId !== undefined && o.authorId !== null)
  @IsUUID()
  authorId?: string | null;

  @ValidateIf((o) => o.tagIds !== null && o.tagIds !== undefined)
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[] | null;

  @IsOptional()
  publishedAt?: Date;
}