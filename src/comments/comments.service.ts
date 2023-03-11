import { CommentsRepository } from './repository/comments.repository';
import { CommentModel, CommentModelType } from './entity/comments.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentsService {
  constructor(
    protected commentRepository: CommentsRepository,
    @InjectModel(CommentModel.name)
    private readonly CommentModel: Model<CommentModelType>,
  ) {}

  async updateComment(commentID: string, commentDTO: UpdateCommentDto) {
    const findComment: CommentModelType | null =
      await this.commentRepository.findCommentById(commentID);

    if (!findComment) {
      throw new NotFoundException();
    }

    await findComment.updateComment(commentDTO);

    await this.commentRepository.save(findComment);
  }

  async deleteComment(commentID: string) {
    const findComment: CommentModelType =
      await this.commentRepository.findCommentById(commentID);

    if (!findComment) {
      throw new NotFoundException();
    }

    await this.commentRepository.deleteComment(commentID);
  }

  async deleteAllComments() {
    await this.commentRepository.deleteAllComments();
  }
}
