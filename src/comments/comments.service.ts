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
import {
  CreateCommentOfPostDto,
  GetAllCommentsDto,
  GetCommentDto,
  QueryCommentDto,
  UpdateCommentDto,
} from './dto';
import { PostsService } from '../posts/posts.service';
import { CommentsQueryRepository } from './repository/comments.query-repository';
import { GetAllPostsDto, QueryPostDto } from '../posts/dto';

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

  async createCommentOfPost(
    postID: string,
    commentDTO: CreateCommentOfPostDto,
  ): Promise<GetCommentDto> {
    const newCommentDto = {
      content: commentDTO.content,
      postId: postID,
    };

    const createCommentSmart: CommentModelType = await new this.CommentModel(
      newCommentDto,
    );

    await this.commentRepository.save(createCommentSmart);

    return this.commentQueryRepository.findCommentById(createCommentSmart._id);
  }

  async getAllCommentsOfPost(
    postID: string,
    queryAll: QueryCommentDto,
  ): Promise<GetAllCommentsDto> {
    return this.commentQueryRepository.getAllCommentsOfPost(postID, queryAll);
  }
}
