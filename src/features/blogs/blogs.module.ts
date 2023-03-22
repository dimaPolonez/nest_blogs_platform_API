import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, BlogModelSchema } from './entity/blogs.entity';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './repository/blogs.repository';
import { BlogsQueryRepository } from './repository/blogs.query-repository';
import { BlogsController } from './blogs.controller';
import { PostsModule } from '../posts/posts.module';
import {
  BasicStrategy,
  JwtRefreshStrategy,
  QuestJwtAccessStrategy,
} from '../../guards-handlers/strategies';
import { findBlog } from '../../validation';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogModelSchema },
    ]),
    forwardRef(() => PostsModule),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    BasicStrategy,
    JwtService,
    QuestJwtAccessStrategy,
    findBlog,
  ],
  exports: [BlogsService],
})
export class BlogsModule {}
