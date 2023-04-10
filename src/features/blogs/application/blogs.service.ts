import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModel, BlogModelType } from '../core/entity/blogs.entity';
import { BlogsRepository } from '../repository/blogs.repository';
import { PostsService } from '../../posts/application/posts.service';
import {
  CreateBlogType,
  CreatePostOfBlogAllType,
  CreatePostOfBlogType,
  GetAllPostsOfBlogType,
  GetPostOfBlogType,
  QueryPostOfBlogType,
  UpdateBlogType,
} from '../core/models';

@Injectable()
export class BlogsService {
  constructor(
    protected blogRepository: BlogsRepository,
    @Inject(forwardRef(() => PostsService))
    protected postsService: PostsService,
    @InjectModel(BlogModel.name)
    protected readonly BlogModel: Model<BlogModelType>,
  ) {}

  async checkBlog(blogID: string): Promise<boolean> {
    const checkedBlog: BlogModelType | null =
      await this.blogRepository.findBlogById(blogID);

    if (!checkedBlog) {
      return false;
    }
    return true;
  }

  async findBlogName(blogID: string): Promise<null | string> {
    const findBlog: null | BlogModelType =
      await this.blogRepository.findBlogById(blogID);

    if (!findBlog) {
      return null;
    }

    return findBlog.name;
  }

  async deleteAllBlogs() {
    await this.blogRepository.deleteAllBlogs();
  }
  async createPostOfBlog(
    postDTO: CreatePostOfBlogAllType,
  ): Promise<GetPostOfBlogType> {
    const blogName: string = await this.findBlogName(postDTO.blogId);

    if (!blogName) {
      throw new NotFoundException('blog not found');
    }

    const newPostDTO: CreatePostOfBlogAllType = {
      ...postDTO,
      blogName: blogName,
    };

    return await this.postsService.createPostOfBlog(newPostDTO);
  }

  async getAllPostsOfBlog(
    userID: string,
    blogID: string,
    queryAll: QueryPostOfBlogType,
  ): Promise<GetAllPostsOfBlogType> {
    const blogFound: boolean = await this.checkBlog(blogID);

    if (!blogFound) {
      throw new NotFoundException('blog not found');
    }

    return await this.postsService.getAllPostsOfBlog(userID, blogID, queryAll);
  }
}
