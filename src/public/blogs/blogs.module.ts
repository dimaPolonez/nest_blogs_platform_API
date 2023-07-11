import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './repository/blogs.repository';
import { BlogsQueryRepository } from './repository/blogs.query-repository';
import { BlogsController } from './blogs.controller';
import {
  BasicStrategy,
  QuestJwtAccessStrategy,
} from '../../guards-handlers/strategies';
import { findBlog } from '../../validation';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { BlogModel, BlogModelSchema } from '../../core/entity';
import { PostsQueryRepository } from '../posts/repository/posts.query-repository';

const strategies = [BasicStrategy, JwtService, QuestJwtAccessStrategy];
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogModelSchema },
    ]),
    UsersModule,
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    PostsQueryRepository,
    BlogsQueryRepository,
    ...strategies,
    findBlog,
  ],
  exports: [BlogsService],
})
export class BlogsModule {}
