import { IsString, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePortfolioImageDto {
  @ApiProperty({ example: 'https://example.com/images/project.jpg' })
  @IsUrl()
  url: string;

  @ApiPropertyOptional({ example: 'تصویر اصلی پروژه' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ example: 'لوگو فروشگاه' })
  @IsOptional()
  @IsString()
  altText?: string;
}
