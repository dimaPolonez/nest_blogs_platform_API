import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, BlogModelSchema } from './core/entity/blogs.entity';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './repository/blogs.repository';
import { BlogsQueryRepository } from './repository/blogs.query-repository';
import { BlogsController } from './blogs.controller';
import { PostsModule } from '../posts/posts.module';
import {
  BasicStrategy,
  QuestJwtAccessStrategy,
} from '../../guards-handlers/strategies';
import { findBlog } from '../../validation';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AgregateModule } from '../../agregate/agregate.module';

const strategies = [BasicStrategy, JwtService, QuestJwtAccessStrategy];
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogModelSchema },
    ]),
    forwardRef(() => PostsModule),
    UsersModule,
    AgregateModule,
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    ...strategies,
    findBlog,
  ],
  exports: [BlogsService],
})
export class BlogsModule {}
