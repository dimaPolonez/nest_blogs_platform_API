import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentModel, CommentModelType } from '../entity/comments.entity';
import { mongoID } from '../../../models';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(CommentModel.name)
    private readonly CommentModel: Model<CommentModelType>,
  ) {}

  async findCommentById(
    commentID: mongoID | string,
  ): Promise<CommentModelType | null> {
    return this.CommentModel.findById(commentID);
  }

  async deleteComment(commentID: string | mongoID) {
    await this.CommentModel.deleteOne({ _id: commentID });
  }

  async deleteAllComments() {
    await this.CommentModel.deleteMany();
  }

  async save(model: CommentModelType) {
    return await model.save();
  }
}
