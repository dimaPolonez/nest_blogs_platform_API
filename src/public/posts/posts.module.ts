import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './repository/posts.repository';
import { PostsQueryRepository } from './repository/posts.query-repository';
import { CommentsModule } from '../comments/comments.module';
import {
  BasicStrategy,
  JwtAccessStrategy,
  QuestJwtAccessStrategy,
} from '../../guards-handlers/strategies';
import { UsersModule } from '../users/users.module';
import { findBlog } from '../../validation';
import { PostModel, PostModelSchema } from '../../core/entity';

const useCases = [];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostModel.name, schema: PostModelSchema },
    ]),
    CommentsModule,
    UsersModule,
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
