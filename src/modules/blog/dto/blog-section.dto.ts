import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class BlogSectionDto {
  @ApiProperty({
    example: 'مقدمه',
    maxLength: 200,
    description: 'تیتر بخش',
  })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({
    example: 'در توسعه مدرن نرم‌افزار...',
    maxLength: 10000,
    description: 'محتوای بخش',
  })
  @IsString()
  @Length(1, 10000)
  content: string;
}
