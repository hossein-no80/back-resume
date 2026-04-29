import { IsString, IsUrl, IsOptional, IsNumber } from 'class-validator';

export class CreateBlogImageDto {
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}