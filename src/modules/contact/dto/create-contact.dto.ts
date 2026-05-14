// src/modules/contact/dto/create-contact.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '09123456789' })
  @IsOptional()
  @IsString()
  mobilePhone?: string;

  @ApiPropertyOptional({ example: '021-12345678' })
  @IsOptional()
  @IsString()
  landlinePhone?: string;

  @ApiPropertyOptional({ example: 'تهران، خیابان آزادی' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/username' })
  @IsOptional()
  @IsUrl()
  instagramUrl?: string;

  @ApiPropertyOptional({ example: 'https://t.me/username' })
  @IsOptional()
  @IsUrl()
  telegramUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/username' })
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/username' })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;
}
