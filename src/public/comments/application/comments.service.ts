import { CommentsRepository } from '../repository/comments.repository';
import {
  CommentModel,
  CommentModelType,
} from '../../../core/entity/comments.entity';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsService } from '../../posts/application/posts.service';
import { CommentsQueryRepository } from '../repository/comments.query-repository';
import {
  CreateCommentOfPostType,
  GetAllCommentsType,
  GetCommentType,
  MyLikeStatus,
  NewestLikesType,
  QueryCommentType,
  UpdateCommentType,
} from '../core/models';

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

  async likeCounter(
    comment: CommentModelType,
    likeStatus: MyLikeStatus,
    likeCaseString?: string,
  ) {
    if (likeStatus === MyLikeStatus.Like) {
      comment.likesInfo.likesCount++;
    }
    if (likeStatus === MyLikeStatus.Dislike) {
      comment.likesInfo.dislikesCount++;
    }

    switch (likeCaseString) {
      case 'LikeDislike':
        comment.likesInfo.likesCount++;
        comment.likesInfo.dislikesCount--;
        break;
      case 'DislikeLike':
        comment.likesInfo.likesCount--;
        comment.likesInfo.dislikesCount++;
        break;
      case 'NoneDislike':
        comment.likesInfo.dislikesCount--;
        break;
      case 'NoneLike':
        comment.likesInfo.likesCount--;
        break;
    }
  }

  async updateComment(
    userID: string,
    commentID: string,
    commentDTO: UpdateCommentType,
  ) {
    const findComment: CommentModelType | null =
      await this.commentRepository.findCommentById(commentID);

    if (!findComment) {
      throw new NotFoundException('comment not found');
    }

    if (findComment.commentatorInfo.userId !== userID) {
      throw new ForbiddenException("You can't update another user's comment");
    }

    await findComment.updateComment(commentDTO);

    await this.commentRepository.save(findComment);
  }

  async updateLikeStatusComment(
    userID: string,
    login: string,
    commentID: string,
    likeStatus: MyLikeStatus,
  ) {
    const findComment: CommentModelType | null =
      await this.commentRepository.findCommentById(commentID);

    if (!findComment) {
      throw new NotFoundException('comment not found');
    }

    const userActive: NewestLikesType | null =
      findComment.likesInfo.newestLikes.find(
        (value) => value.userId === userID,
      );

    const likesObjectDTO: NewestLikesType = {
      userId: userID,
      login: login,
      myStatus: likeStatus,
      addedAt: new Date().toISOString(),
    };

    if (!userActive) {
      if (likeStatus === 'None') {
        return;
      }
      await this.likeCounter(findComment, likeStatus);
      findComment.likesInfo.newestLikes.push(likesObjectDTO);
      await this.commentRepository.save(findComment);
      return;
    }

    if (userActive.myStatus !== likeStatus) {
      const likeCaseString = likeStatus + userActive.myStatus;
      await this.likeCounter(findComment, MyLikeStatus.None, likeCaseString);

      if (likeStatus === MyLikeStatus.None) {
        findComment.likesInfo.newestLikes =
          findComment.likesInfo.newestLikes.filter((v) => v.userId !== userID);
        await this.commentRepository.save(findComment);
        return;
      }
      const findActivity = findComment.likesInfo.newestLikes.find(
        (v) => v.userId === userID,
      );

      findActivity.myStatus = likeStatus;

      findComment.likesInfo.newestLikes =
        findComment.likesInfo.newestLikes.filter((v) => v.userId !== userID);

      findComment.likesInfo.newestLikes.push(findActivity);

      await this.commentRepository.save(findComment);
      /*await this.commentRepository.updateStatusLikeComment(
        commentID,
        userID,
        likeStatus,
      );*/
    }
  }

  async deleteComment(userID: string, commentID: string) {
    const findComment: CommentModelType =
      await this.commentRepository.findCommentById(commentID);

    if (!findComment) {
      throw new NotFoundException('comment not found');
    }

    if (findComment.commentatorInfo.userId !== userID) {
      throw new ForbiddenException("You can't delete another user's comment");
    }

    await this.commentRepository.deleteComment(commentID);
  }

  async deleteAllComments() {
    await this.commentRepository.deleteAllComments();
  }

  async createCommentOfPost(
    newCommentDTO: CreateCommentOfPostType,
  ) /*: Promise<GetCommentType>*/ {
    const createCommentSmart: CommentModelType = await new this.CommentModel(
      newCommentDTO,
    );

    await this.commentRepository.save(createCommentSmart);

    return this.commentQueryRepository.findCommentById(createCommentSmart.id);
  }

  async getAllCommentsOfPost(
    userID: string,
    postID: string,
    queryAll: QueryCommentType,
  ): Promise<GetAllCommentsType> {
    return this.commentQueryRepository.getAllCommentsOfPost(
      userID,
      postID,
      queryAll,
    );
  }
}
