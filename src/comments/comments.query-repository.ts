import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentModel, CommentModelType } from './comments.entity';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    protected commentRepository: CommentsRepository,
    @InjectModel(CommentModel.name)
    private readonly CommentModel: Model<CommentModelType>,
  ) {}
}
