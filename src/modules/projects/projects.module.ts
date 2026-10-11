import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { ProjectTranslation } from './entities/project-translation.entity';
import { ProjectsSeeder } from '../../database/seeder/projects.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectTranslation])],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsSeeder],
  exports: [ProjectsService],
})
export class ProjectsModule {}
