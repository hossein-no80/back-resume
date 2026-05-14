import { IsString, IsUrl, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogImageDto {
  @IsUrl()
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  url: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'توضیح تصویر' })
  caption?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'متن جایگزین' })
  altText?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 1 })
  order?: number;
}