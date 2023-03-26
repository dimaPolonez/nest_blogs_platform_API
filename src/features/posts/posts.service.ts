import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostModel, PostModelType } from './entity/posts.entity';
import { PostsRepository } from './repository/posts.repository';
import { PostsQueryRepository } from './repository/posts.query-repository';
import { BlogsService } from '../blogs/blogs.service';
import { CommentsService } from '../comments/comments.service';
import {
  CreateCommentOfPostType,
  CreatePostType,
  GetAllCommentsOfPostType,
  GetAllPostsType,
  GetCommentOfPostType,
  GetPostType,
  MyLikeStatus,
  NewCommentObjectType,
  NewestLikesType,
  QueryCommentType,
  QueryPostType,
  UpdatePostType,
} from './models';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    protected postRepository: PostsRepository,
    protected postQueryRepository: PostsQueryRepository,
    @Inject(forwardRef(() => BlogsService))
    protected blogService: BlogsService,
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

  async createPost(postDTO: CreatePostType): Promise<string> {
    const findBlogName: string = await this.blogService.findBlogName(
      postDTO.blogId,
    );

    const newPostDTO = { ...postDTO, blogName: findBlogName };

    const createPostSmart = await new this.PostModel(newPostDTO);

    await this.postRepository.save(createPostSmart);

    return createPostSmart.id;
  }

  async updatePost(postID: string, postDTO: UpdatePostType) {
    const findPost: PostModelType | null =
      await this.postRepository.findPostById(postID);

    if (!findPost) {
      throw new NotFoundException('post not found');
    }

    const findBlogName: string = await this.blogService.findBlogName(
      postDTO.blogId,
    );

    const newPostDTO = { ...postDTO, blogName: findBlogName };

    await findPost.updatePost(newPostDTO);

    await this.postRepository.save(findPost);
  }

  async deletePost(postID: string) {
    const findPost: PostModelType = await this.postRepository.findPostById(
      postID,
    );

    if (!findPost) {
      throw new NotFoundException('post not found');
    }

    await this.postRepository.deletePost(postID);
  }

  async deleteAllPosts() {
    await this.postRepository.deleteAllPosts();
  }

  async createPostOfBlog(newPostDTO: CreatePostType): Promise<GetPostType> {
    const createPostSmart: PostModelType | null = await new this.PostModel(
      newPostDTO,
    );

    await this.postRepository.save(createPostSmart);

    return await this.postQueryRepository.findPostById(createPostSmart.id);
  }

  async getAllPostsOfBlog(
    userID: string,
    blogID: string,
    queryAll: QueryPostType,
  ): Promise<GetAllPostsType> {
    return this.postQueryRepository.getAllPosts(userID, queryAll, blogID);
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

      await this.postRepository.updateStatusLikePost(userID, likeStatus);
      await this.postRepository.save(findPost);
      return;
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
