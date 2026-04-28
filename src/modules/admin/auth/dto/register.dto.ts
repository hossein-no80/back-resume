import { IsEmail, IsStrongPassword, IsNotEmpty } from 'class-validator';
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  lastname: string;
  firstname: string;
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
  age: number;
}
