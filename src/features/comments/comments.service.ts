import { CommentsRepository } from './repository/comments.repository';
import { CommentModel, CommentModelType } from './entity/comments.entity';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsService } from '../posts/posts.service';
import { CommentsQueryRepository } from './repository/comments.query-repository';
import {
  CreateCommentOfPostType,
  GetAllCommentsType,
  GetCommentType,
  QueryCommentType,
  UpdateCommentType,
} from './models';

@Injectable()
export class CommentsService {
  constructor(
    protected commentRepository: CommentsRepository,
    protected commentQueryRepository: CommentsQueryRepository,
    @Inject(forwardRef(() => PostsService))
    protected postsService: PostsService,
    @InjectModel(CommentModel.name)
    private readonly CommentModel: Model<CommentModelType>,
  ) {}

  async updateComment(commentID: string, commentDTO: UpdateCommentType) {
    const findComment: CommentModelType | null =
      await this.commentRepository.findCommentById(commentID);

    if (!findComment) {
      throw new NotFoundException('comment not found');
    }

    await findComment.updateComment(commentDTO);

    await this.commentRepository.save(findComment);
  }

  async deleteComment(commentID: string) {
    const findComment: CommentModelType =
      await this.commentRepository.findCommentById(commentID);

    if (!findComment) {
      throw new NotFoundException('comment not found');
    }

    await this.commentRepository.deleteComment(commentID);
  }

  async deleteAllComments() {
    await this.commentRepository.deleteAllComments();
  }

  async createCommentOfPost(
    newCommentDTO: CreateCommentOfPostType,
  ): Promise<GetCommentType> {
    const createCommentSmart: CommentModelType = await new this.CommentModel(
      newCommentDTO,
    );

    await this.commentRepository.save(createCommentSmart);

    return this.commentQueryRepository.findCommentById(createCommentSmart.id);
  }

  async getAllCommentsOfPost(
    postID: string,
    queryAll: QueryCommentType,
  ): Promise<GetAllCommentsType> {
    return this.commentQueryRepository.getAllCommentsOfPost(postID, queryAll);
  }
}
