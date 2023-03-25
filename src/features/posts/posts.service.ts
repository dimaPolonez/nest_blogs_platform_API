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
  NewCommentObjectType,
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
    blogID: string,
    queryAll: QueryPostType,
  ): Promise<GetAllPostsType> {
    return this.postQueryRepository.getAllPosts(queryAll, blogID);
  }

  async createCommentOfPost(
    postID: string,
    commentDTO: CreateCommentOfPostType,
    userID: string,
    login: string,
  ): Promise<GetCommentOfPostType> {
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
