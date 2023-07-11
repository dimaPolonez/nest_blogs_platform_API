import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModel, PostModelSchema } from '../../core/entity/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './repository/posts.repository';
import { PostsQueryRepository } from './repository/posts.query-repository';
import { BlogsModule } from '../blogs/blogs.module';
import { CommentsModule } from '../comments/comments.module';
import {
  BasicStrategy,
  JwtAccessStrategy,
  QuestJwtAccessStrategy,
} from '../../guards-handlers/strategies';
import { UsersModule } from '../users/users.module';
import { findBlog } from '../../validation';
import { AgregateModule } from '../agregate/agregate.module';
import { CreateBlogToBloggerUseCase } from '../../private/blogger/use-cases/create-blog-to-blogger-use-case';
import { UpdateBlogToBloggerUseCase } from '../../private/blogger/use-cases/update-blog-to-blogger-use-case';
import { DeleteBlogToBloggerUseCase } from '../../private/blogger/use-cases/delete-blog-to-blogger-use-case';
import { CreatePostOfBlogToBloggerUseCase } from '../../private/blogger/use-cases/create-post-of-blog-use-case';

const useCases = [];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostModel.name, schema: PostModelSchema },
    ]),
    forwardRef(() => BlogsModule),
    forwardRef(() => CommentsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    QuestJwtAccessStrategy,
    BasicStrategy,
    JwtAccessStrategy,
    findBlog,
    ...useCases,
  ],
  exports: [PostsService, PostsQueryRepository],
})
export class PostsModule {}
