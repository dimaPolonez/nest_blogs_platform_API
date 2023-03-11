import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentModel, CommentModelType } from '../entity/comments.entity';
import { mongoID } from '../../models';
import { GetCommentDto } from '../dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    protected commentRepository: CommentsRepository,
    @InjectModel(CommentModel.name)
    private readonly CommentModel: Model<CommentModelType>,
  ) {}

  sortObject(sortDir: string) {
    return sortDir === 'desc' ? -1 : 1;
  }
  skippedObject(pageNum: number, pageSize: number) {
    return (pageNum - 1) * pageSize;
  }

  async findCommentById(commentID: mongoID | string): Promise<GetCommentDto> {
    const findCommentSmart = await this.CommentModel.findById(commentID);

    if (!findCommentSmart) {
      throw new NotFoundException();
    }

    return {
      id: findCommentSmart._id,
      content: findCommentSmart.content,
      commentatorInfo: {
        userId: findCommentSmart.commentatorInfo.userId,
        userLogin: findCommentSmart.commentatorInfo.userLogin,
      },
      createdAt: findCommentSmart.createdAt,
      likesInfo: {
        likesCount: findCommentSmart.likesInfo.likesCount,
        dislikesCount: findCommentSmart.likesInfo.dislikesCount,
        myStatus: findCommentSmart.likesInfo.myStatus,
      },
    };
  }
}
