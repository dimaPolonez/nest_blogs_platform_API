import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './repository/comments.repository';
import { CommentsQueryRepository } from './repository/comments.query-repository';
import { CommentModel, CommentModelSchema } from '../../core/entity';
import {
  JwtAccessGuard,
  QuestJwtAccessGuard,
} from '../../guards-handlers/guard';
import { CqrsModule } from '@nestjs/cqrs';
import {
  DeleteCommentUseCase,
  UpdateCommentUseCase,
  UpdateLikeStatusCommentUseCase,
} from './application/use-cases';
import { AuthModule } from '../../auth/auth.module';

const modules = [CqrsModule, AuthModule];

const guards = [QuestJwtAccessGuard, JwtAccessGuard];

const useCases = [
  UpdateLikeStatusCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentModel.name, schema: CommentModelSchema },
    ]),
    ...modules,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsRepository,
    CommentsQueryRepository,
    ...guards,
    ...useCases,
  ],
})
export class CommentsModule {}
