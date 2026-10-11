import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { About } from './entities/about.entity';
import { AboutTranslation } from './entities/about-translation.entity';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';

@Module({
  imports: [TypeOrmModule.forFeature([About, AboutTranslation])],
  controllers: [AboutController],
  providers: [AboutService],
  exports: [AboutService],
})
export class AboutModule {}
