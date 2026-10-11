import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AboutSectionDataDto,
  AboutExpertiseDataDto,
} from './about-translation.dto';

export class SocialLinksResponseDto {
  @ApiProperty({ example: 'https://github.com/johndoe' })
  github: string;

  @ApiProperty({ example: 'https://linkedin.com/in/johndoe' })
  linkedin: string;

  @ApiProperty({ example: 'https://twitter.com/johndoe' })
  twitter: string;

  @ApiProperty({ example: 'https://youtube.com/@johndoe' })
  youtube: string;

  @ApiProperty({ example: 'https://johndoe.dev' })
  website: string;
}

export class AboutSingleResponseDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '+1 (555) 123-4567' })
  phone: string;

  @ApiPropertyOptional({ example: 'San Francisco, CA', nullable: true })
  location: string | null;

  @ApiProperty({ example: '/uploads/avatar.jpg' })
  avatar: string;

  @ApiPropertyOptional({
    example: 'Engineering systems. Understanding how they work.',
    nullable: true,
  })
  heading: string | null;

  @ApiProperty({ example: "I'm a software engineer..." })
  bio: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'Software Engineer · Security' })
  title: string;

  @ApiProperty({ type: SocialLinksResponseDto })
  socialLinks: SocialLinksResponseDto;

  @ApiProperty({ example: true })
  available: boolean;

  @ApiProperty({ example: true })
  openToWork: boolean;

  @ApiProperty({ example: '/uploads/resume.pdf' })
  resumeUrl: string;

  @ApiProperty({ example: 'John_Doe_Resume.pdf' })
  resumeFileName: string;

  @ApiProperty({ type: [AboutSectionDataDto] })
  aboutSections: AboutSectionDataDto[];

  @ApiProperty({ type: [AboutExpertiseDataDto] })
  expertise: AboutExpertiseDataDto[];

  @ApiProperty({ example: 'en', description: 'زبان پاسخ' })
  language: string;

  @ApiProperty({ example: '2026-10-07T20:29:34.062Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-07T20:29:34.062Z' })
  updatedAt: Date;
}

export class AboutTranslationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'en' })
  language: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'Software Engineer · Security' })
  title: string;

  @ApiPropertyOptional({
    example: 'Engineering systems. Understanding how they work.',
    nullable: true,
  })
  heading: string | null;

  @ApiProperty({ example: "I'm a software engineer..." })
  bio: string;

  @ApiPropertyOptional({ example: 'San Francisco, CA', nullable: true })
  location: string | null;

  @ApiProperty({ type: [AboutSectionDataDto] })
  aboutSections: AboutSectionDataDto[];

  @ApiProperty({ type: [AboutExpertiseDataDto] })
  expertise: AboutExpertiseDataDto[];
}

export class AboutFullResponseDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '+1 (555) 123-4567' })
  phone: string;

  @ApiProperty({ example: '/uploads/avatar.jpg' })
  avatar: string;

  @ApiProperty({ example: '/uploads/resume.pdf' })
  resumeUrl: string;

  @ApiProperty({ example: 'John_Doe_Resume.pdf' })
  resumeFileName: string;

  @ApiProperty({ type: SocialLinksResponseDto })
  socialLinks: SocialLinksResponseDto;

  @ApiProperty({ example: true })
  available: boolean;

  @ApiProperty({ example: true })
  openToWork: boolean;

  @ApiProperty({ type: [AboutTranslationResponseDto] })
  translations: AboutTranslationResponseDto[];

  @ApiProperty({ example: '2026-10-07T20:29:34.062Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-07T20:29:34.062Z' })
  updatedAt: Date;
}
