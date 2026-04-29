import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { Blog } from './entities/blog.entity';
import { BlogTranslation } from './entities/blog-translation.entity';
import { Author } from './entities/author.entity';
import { Tag } from './entities/tag.entity';
import { Comment } from './entities/comment.entity';
import { BlogImage } from './entities/blog-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Blog,
      BlogTranslation,
      Author,
      Tag,
      Comment,
      BlogImage,
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
