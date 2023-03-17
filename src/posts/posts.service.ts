import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { mongoID } from '../models';
import { PostModel, PostModelType } from './entity/posts.entity';
import { PostsRepository } from './repository/posts.repository';
import {
  CreatePostDto,
  GetAllPostsDto,
  GetPostDto,
  QueryPostDto,
  UpdatePostDto,
} from './dto';
import { PostsQueryRepository } from './repository/posts.query-repository';
import { BlogsService } from '../blogs/blogs.service';
import { CommentsService } from '../comments/comments.service';
import {
  GetAllCommentsDto,
  GetCommentDto,
  QueryCommentDto,
  CreateCommentOfPostDto,
} from '../comments/dto';

@Injectable()
export class PostsService {
  constructor(
    protected postRepository: PostsRepository,
    protected postQueryRepository: PostsQueryRepository,
    @Inject(forwardRef(() => BlogsService))
    protected blogService: BlogsService,
    @Inject(forwardRef(() => CommentsService))
    protected commentsService: CommentsService,
    @InjectModel(PostModel.name)
    private readonly PostModel: Model<PostModelType>,
  ) {}

  async createPost(postDTO: CreatePostDto): Promise<mongoID> {
    const findBlogName: null | string = await this.blogService.findBlogName(
      postDTO.blogId,
    );

    if (!findBlogName) {
      throw new BadRequestException('Incorrect blogId');
    }

    const newPostDTO = { ...postDTO, blogName: findBlogName };

    const createPostSmart = await new this.PostModel(newPostDTO);

    await this.postRepository.save(createPostSmart);

    return createPostSmart._id;
  }

  async updatePost(postID: string, postDTO: UpdatePostDto) {
    const findPost: PostModelType | null =
      await this.postRepository.findPostById(postID);

    if (!findPost) {
      throw new NotFoundException();
    }

    const findBlogName: null | string = await this.blogService.findBlogName(
      postDTO.blogId,
    );

    if (!findBlogName) {
      throw new BadRequestException('Incorrect blogId');
    }

    const newPostDTO = { ...postDTO, blogName: findBlogName };

    await findPost.updatePost(newPostDTO);

    await this.postRepository.save(findPost);
  }

  async deletePost(postID: string) {
    const findPost: PostModelType = await this.postRepository.findPostById(
      postID,
    );

    if (!findPost) {
      throw new NotFoundException();
    }

    await this.postRepository.deletePost(postID);
  }

  async deleteAllPosts() {
    await this.postRepository.deleteAllPosts();
  }

  async createPostOfBlog(newPostDTO: CreatePostDto): Promise<GetPostDto> {
    const createPostSmart = await new this.PostModel(newPostDTO);

    await this.postRepository.save(createPostSmart);

    return await this.postQueryRepository.findPostById(createPostSmart._id);
  }

  async getAllPostsOfBlog(
    blogID: string,
    queryAll: QueryPostDto,
  ): Promise<GetAllPostsDto> {
    return this.postQueryRepository.getAllPosts(queryAll, blogID);
  }

  async createCommentOfPost(
    postID: string,
    commentDTO: CreateCommentOfPostDto,
  ): Promise<GetCommentDto> {
    return await this.commentsService.createCommentOfPost(postID, commentDTO);
  }

  async getAllCommentsOfPost(
    postID: string,
    queryAll: QueryCommentDto,
  ): Promise<GetAllCommentsDto> {
    await this.postQueryRepository.findPostById(postID);

    return await this.commentsService.getAllCommentsOfPost(postID, queryAll);
  }
}
