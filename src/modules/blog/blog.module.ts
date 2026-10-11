import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogPost } from './entities/blog-post.entity';
import { BlogPostTranslation } from './entities/blog-post-translation.entity';
import { BlogSeeder } from '../../database/seeder/blog.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost, BlogPostTranslation])],
  controllers: [BlogController],
  providers: [BlogService, BlogSeeder],
  exports: [BlogService],
})
export class BlogModule {}
