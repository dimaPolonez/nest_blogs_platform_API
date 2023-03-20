import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModel, PostModelSchema } from './entity/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './repository/posts.repository';
import { PostsQueryRepository } from './repository/posts.query-repository';
import { BlogsModule } from '../blogs/blogs.module';
import { CommentsModule } from '../comments/comments.module';
import {
  BasicStrategy,
  JwtAccessStrategy,
  QuestJwtAccessStrategy,
} from '../../guards-handlers/strategies';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostModel.name, schema: PostModelSchema },
    ]),
    forwardRef(() => BlogsModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    QuestJwtAccessStrategy,
    BasicStrategy,
    JwtAccessStrategy,
  ],
  exports: [PostsService],
})
export class PostsModule {}
