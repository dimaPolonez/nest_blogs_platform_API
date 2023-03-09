import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModel, CommentModelSchema } from '../core/entities';
import { CommentsController } from '../controllers';
import { CommentsService } from 'src/services';
import { CommentsQueryRepository, CommentsRepository } from 'src/repositories';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentModel.name, schema: CommentModelSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, CommentsQueryRepository],
})
export class CommentsModule {}
