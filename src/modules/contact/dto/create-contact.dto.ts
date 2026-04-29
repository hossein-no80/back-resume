// src/modules/contact/dto/create-contact.dto.ts
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateContactDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  mobilePhone?: string;

  @IsOptional()
  @IsString()
  landlinePhone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsUrl()
  instagramUrl?: string;

  @IsOptional()
  @IsUrl()
  telegramUrl?: string;

  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;
}