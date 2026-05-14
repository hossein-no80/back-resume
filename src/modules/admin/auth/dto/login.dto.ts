import { IsEmail, IsStrongPassword, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'admin@example.com',
    description: 'ایمیل ادمین (فقط ایمیل ادمین مجاز است)',
  })
  email: string;

  @ApiProperty({
    example: 'Admin@123',
    description:
      'گذرواژه قوی (حداقل ۸ کاراکتر، شامل حروف بزرگ، کوچک، عدد و نماد)',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
