import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModel, CommentModelSchema } from './entity/comments.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './repository/comments.repository';
import { CommentsQueryRepository } from './repository/comments.query-repository';
import { PostsModule } from '../posts/posts.module';
import {
  JwtAccessStrategy,
  QuestJwtAccessStrategy,
} from '../../guards-handlers/strategies';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentModel.name, schema: CommentModelSchema },
    ]),
    forwardRef(() => PostsModule),
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    QuestJwtAccessStrategy,
    JwtAccessStrategy,
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
