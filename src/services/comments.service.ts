import { CommentsRepository } from '../repositories/comments.repository';
import {
  CommentModel,
  CommentModelType,
} from '../core/entities/comments.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    protected commentRepository: CommentsRepository,
    @InjectModel(CommentModel.name)
    private readonly CommentModel: Model<CommentModelType>,
  ) {}
}
