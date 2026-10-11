import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'علی رضایی', minLength: 2, maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  senderName: string;

  @ApiProperty({ example: 'ali@example.com' })
  @IsNotEmpty()
  @IsEmail()
  senderEmail: string;

  @ApiProperty({ example: 'درخواست مشاوره', minLength: 3, maxLength: 200 })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  subject: string;

  @ApiProperty({ example: 'متن پیام شما...', minLength: 10, maxLength: 5000 })
  @IsNotEmpty()
  @IsString()
  @Length(10, 5000)
  message: string;
}
