import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
}
