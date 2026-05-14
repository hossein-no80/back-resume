import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ example: 'عملیات با موفقیت انجام شد' })
  message: string;
}
