import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentModel, CommentModelType } from './comment.entity';

@Injectable()
export class CommentQueryRepository {
  constructor(
    protected commentRepository: CommentRepository,
    @InjectModel(CommentModel.name)
    private readonly CommentModel: Model<CommentModelType>,
  ) {}
}
