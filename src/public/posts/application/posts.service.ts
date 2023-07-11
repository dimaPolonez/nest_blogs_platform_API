import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostsRepository } from '../repository/posts.repository';
import { PostsQueryRepository } from '../repository/posts.query-repository';
import { CommentsService } from '../../comments/application/comments.service';
import { UsersService } from '../../users/application/users.service';
import {
  CreateCommentOfPostType,
  GetAllCommentsOfPostType,
  GetCommentOfPostType,
  MyLikeStatus,
  NewCommentObjectType,
  NewestLikesType,
  QueryCommentType,
} from '../../../core/models';
import { PostModel, PostModelType } from 'src/core/entity';

@Injectable()
export class PostsService {
  constructor(
    protected postRepository: PostsRepository,
    protected postQueryRepository: PostsQueryRepository,
    @Inject(forwardRef(() => CommentsService))
    protected commentsService: CommentsService,
    @Inject(forwardRef(() => UsersService))
    protected usersService: UsersService,
    @InjectModel(PostModel.name)
    private readonly PostModel: Model<PostModelType>,
  ) {}

  async likeCounter(
    post: PostModelType,
    likeStatus: MyLikeStatus,
    likeCaseString?: string,
  ) {
    if (likeStatus === MyLikeStatus.Like) {
      post.extendedLikesInfo.likesCount++;
    }
    if (likeStatus === MyLikeStatus.Dislike) {
      post.extendedLikesInfo.dislikesCount++;
    }

    switch (likeCaseString) {
      case 'LikeDislike':
        post.extendedLikesInfo.likesCount++;
        post.extendedLikesInfo.dislikesCount--;
        break;
      case 'DislikeLike':
        post.extendedLikesInfo.likesCount--;
        post.extendedLikesInfo.dislikesCount++;
        break;
      case 'NoneDislike':
        post.extendedLikesInfo.dislikesCount--;
        break;
      case 'NoneLike':
        post.extendedLikesInfo.likesCount--;
        break;
    }
  }

  async deleteAllPosts() {
    await this.postRepository.deleteAllPosts();
  }

  async updateLikeStatusPost(
    userID: string,
    login: string,
    postID: string,
    likeStatus: MyLikeStatus,
  ) {
    const findPost: PostModelType = await this.postRepository.findPostById(
      postID,
    );

    if (!findPost) {
      throw new NotFoundException('post not found');
    }

    const userActive: NewestLikesType | null =
      findPost.extendedLikesInfo.newestLikes.find((v) => v.userId === userID);

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
      await this.likeCounter(findPost, likeStatus);
      findPost.extendedLikesInfo.newestLikes.push(likesObjectDTO);
      await this.postRepository.save(findPost);
      return;
    }
    if (userActive.myStatus !== likeStatus) {
      const likeCaseString = likeStatus + userActive.myStatus;
      await this.likeCounter(findPost, MyLikeStatus.None, likeCaseString);

      if (likeStatus === MyLikeStatus.None) {
        findPost.extendedLikesInfo.newestLikes =
          findPost.extendedLikesInfo.newestLikes.filter(
            (v) => v.userId !== userID,
          );
        await this.postRepository.save(findPost);
        return;
      }
      const findActivity = findPost.extendedLikesInfo.newestLikes.find(
        (v) => v.userId === userID,
      );

      findActivity.myStatus = likeStatus;

      findPost.extendedLikesInfo.newestLikes =
        findPost.extendedLikesInfo.newestLikes.filter(
          (v) => v.userId !== userID,
        );

      findPost.extendedLikesInfo.newestLikes.push(findActivity);

      await this.postRepository.save(findPost);

      //await this.postRepository.updateStatusLikePost(userID, likeStatus);
    }
  }

  async createCommentOfPost(
    postID: string,
    commentDTO: CreateCommentOfPostType,
    userID: string,
    login: string,
  ): Promise<GetCommentOfPostType> {
    const findPost: PostModelType = await this.postRepository.findPostById(
      postID,
    );

    if (!findPost) {
      throw new NotFoundException('post not found');
    }

    const newCommentDTO: NewCommentObjectType = {
      content: commentDTO.content,
      commentatorInfo: {
        userId: userID,
        userLogin: login,
      },
      postId: postID,
    };
    return await this.commentsService.createCommentOfPost(newCommentDTO);
  }

  async getAllCommentsOfPost(
    userID: string,
    postID: string,
    queryAll: QueryCommentType,
  ): Promise<GetAllCommentsOfPostType> {
    await this.postQueryRepository.findPostById(postID);

    return await this.commentsService.getAllCommentsOfPost(
      userID,
      postID,
      queryAll,
    );
  }
}
