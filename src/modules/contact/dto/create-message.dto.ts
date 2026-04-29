import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  senderName: string;

  @IsNotEmpty()
  @IsEmail()
  senderEmail: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  subject: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 5000)
  message: string;
}