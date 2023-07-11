import { CqrsModule } from '@nestjs/cqrs';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, BlogModelSchema } from '../../core/entity/blogs.entity';
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
import { AgregateModule } from '../agregate/agregate.module';
import { CreateBlogToBloggerUseCase } from '../../private/blogger/use-cases/create-blog-to-blogger-use-case';
import { BloggerController } from '../../private/blogger/blogger.controller';
import { DeleteBlogToBloggerUseCase } from '../../private/blogger/use-cases/delete-blog-to-blogger-use-case';
import { UpdateBlogToBloggerUseCase } from '../../private/blogger/use-cases/update-blog-to-blogger-use-case';
import { CreatePostOfBlogToBloggerUseCase } from '../../private/blogger/use-cases/create-post-of-blog-use-case';
import { DeletePostOfBlogToBloggerUseCase } from '../../private/blogger/use-cases/delete-post-of-blog-use-case';
import { UpdatePostOfBlogToBloggerUseCase } from '../../private/blogger/use-cases/update-post-of-blog-use-case';
import { PostsRepository } from '../posts/repository/posts.repository';

const strategies = [BasicStrategy, JwtService, QuestJwtAccessStrategy];
const useCases = [
  CreateBlogToBloggerUseCase,
  UpdateBlogToBloggerUseCase,
  DeleteBlogToBloggerUseCase,
  CreatePostOfBlogToBloggerUseCase,
];
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogModelSchema },
    ]),
    UsersModule,
    AgregateModule,
  ],
  controllers: [BlogsController, BloggerController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    ...useCases,
    ...strategies,
    findBlog,
  ],
  exports: [BlogsService],
})
export class BlogsModule {}
