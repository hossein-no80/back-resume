// src/seeder/seeder.service.ts
import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import UserEntity from '../../modules/admin/users/entities/user.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      this.logger.warn(
        'ADMIN_EMAIL or ADMIN_PASSWORD not set in .env. Skipping admin seed.',
      );
      return;
    }

    const existingAdmin = await this.userRepo.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const admin = this.userRepo.create({
        email: adminEmail,
        password: hashedPassword,
        firstname: 'Hossein',
        lastname: 'Rezaei',
        age: 24,
        refreshToken: null,
      } as UserEntity); // استفاده از as UserEntity برای رفع خطای TypeScript

      await this.userRepo.save(admin);
      this.logger.log('✅ Admin user seeded successfully');
    } else {
      this.logger.log('ℹ️ Admin user already exists, skipping seed');
    }
  }
}