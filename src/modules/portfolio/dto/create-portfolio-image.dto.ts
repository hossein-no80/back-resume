import { IsString, IsUrl, IsOptional } from 'class-validator';

export class CreatePortfolioImageDto {
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  altText?: string;
}