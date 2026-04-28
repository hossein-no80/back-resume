import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsString,
  IsUrl,
  IsDateString,
  ArrayMinSize,
  IsNumber, IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePortfolioTranslationDto } from './create-portfolio-translation.dto';
import { CreatePortfolioImageDto } from './create-portfolio-image.dto';
import { PortfolioStatus } from '../entities/portfolio-status.enum';

export class CreatePortfolioDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePortfolioTranslationDto)
  @ArrayMinSize(1)
  translations: CreatePortfolioTranslationDto[];

  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsEnum(PortfolioStatus)
  status?: PortfolioStatus;

  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @IsOptional()
  @IsDateString()
  projectDate?: Date;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  skillIds?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePortfolioImageDto)
  images?: CreatePortfolioImageDto[];
}
