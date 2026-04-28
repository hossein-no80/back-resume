import { IsEmail, IsStrongPassword, IsNotEmpty } from 'class-validator';
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
