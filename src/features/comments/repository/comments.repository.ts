import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentModel, CommentModelType } from '../entity/comments.entity';
import { MyLikeStatus } from '../models';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(CommentModel.name)
    private readonly CommentModel: Model<CommentModelType>,
  ) {}

  async findCommentById(commentID: string): Promise<CommentModelType | null> {
    return this.CommentModel.findById({ _id: commentID });
  }

  async updateStatusLikeComment(
    commentID: string,
    userID: string,
    likeStatus: MyLikeStatus,
  ) {
    await this.CommentModel.updateOne(
      { 'commentID.likesInfo.newestLikes.userId': userID },
      {
        $set: {
          'commentID.likesInfo.newestLikes.$.myStatus': likeStatus,
        },
      },
    );
  }

  async deleteComment(commentID: string) {
    await this.CommentModel.deleteOne({ _id: commentID });
  }

  async deleteAllComments() {
    await this.CommentModel.deleteMany();
  }

  async save(model: CommentModelType) {
    return await model.save();
  }
}
