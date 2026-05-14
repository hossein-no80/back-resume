import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'توکن دسترسی (Access Token) - معتبر ۱۵ دقیقه',
  })
  access_token: string;
}
