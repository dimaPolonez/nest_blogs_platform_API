import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModel, BlogModelType } from './entity/blogs.entity';
import { BlogsRepository } from './repository/blogs.repository';
import { PostsService } from '../posts/posts.service';
import {
  CreateBlogType,
  CreatePostOfBlogAllType,
  CreatePostOfBlogType,
  GetAllPostsOfBlogType,
  GetPostOfBlogType,
  QueryPostOfBlogType,
  UpdateBlogType,
} from './models';

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

  async createBlog(blogDTO: CreateBlogType): Promise<string> {
    const createBlogSmart: BlogModelType = await new this.BlogModel(blogDTO);

    await this.blogRepository.save(createBlogSmart);

    return createBlogSmart.id;
  }

  async updateBlog(blogID: string, blogDTO: UpdateBlogType) {
    const findBlog: BlogModelType | null =
      await this.blogRepository.findBlogById(blogID);

    if (!findBlog) {
      throw new NotFoundException('blog not found');
    }

    await findBlog.updateBlog(blogDTO);

    await this.blogRepository.save(findBlog);
  }

  async deleteBlog(blogID: string) {
    const findBlog: boolean = await this.checkBlog(blogID);

    if (!findBlog) {
      throw new NotFoundException('blog not found');
    }

    await this.blogRepository.deleteBlog(blogID);
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
    blogID: string,
    queryAll: QueryPostOfBlogType,
  ): Promise<GetAllPostsOfBlogType> {
    const blogFound: boolean = await this.checkBlog(blogID);

    if (!blogFound) {
      throw new NotFoundException('blog not found');
    }

    return await this.postsService.getAllPostsOfBlog(blogID, queryAll);
  }
}
