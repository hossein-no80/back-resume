import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from './entities/interest.entity';
import { InterestTranslation } from './entities/interest-translation.entity';
import { InterestService } from './interest.service';

@Module({
  imports: [TypeOrmModule.forFeature([Interest, InterestTranslation])],
  providers: [InterestService],
  exports: [InterestService],
})
export class InterestModule {}
