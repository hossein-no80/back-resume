import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user_repository: Repository<UserEntity>,
  ) {}

  async findOneById(id: number): Promise<UserEntity | null> {
    return await this.user_repository.findOne({ where: { id } });
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    await this.user_repository.update(userId, { refreshToken });
  }

  async findAll() {
    return await this.user_repository.find();
  }

  createUser(data: RegisterDto) {
    const user = this.user_repository.create(data);
    this.user_repository.save(user);
    return user;
  }

  // createUser(data: RegisterDto) {
  //   throw new ForbiddenException('Cannot create new user');
  // }

  findUserByEmail = async (email: string) => {
    return await this.user_repository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  };










  findOne(id: number) {
    return `This action removes a #${id} user`; // پیاده‌سازی موقت (همانند قبل)
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
