import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class WorkingHourDto {
  @ApiProperty({
    example: 'دوشنبه تا جمعه',
    maxLength: 100,
    description: 'روز یا بازه روزها',
  })
  @IsString()
  @Length(1, 100)
  day: string;

  @ApiProperty({
    example: '۹:۰۰ تا ۱۸:۰۰',
    maxLength: 100,
    description: 'ساعت کاری یا "تعطیل"',
  })
  @IsString()
  @Length(1, 100)
  hours: string;
}
