import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { mongoID } from '../models';
import { BlogModel, BlogModelType } from './entity/blogs.entity';
import { BlogsRepository } from './repository/blogs.repository';
import { CreateBlogDto, CreatePostOfBlogDto, UpdateBlogDto } from './dto';
import {
  CreatePostDto,
  GetAllPostsDto,
  GetPostDto,
  QueryPostDto,
} from '../posts/dto';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class BlogsService {
  constructor(
    protected blogRepository: BlogsRepository,
    @Inject(forwardRef(() => PostsService))
    protected postsService: PostsService,
    @InjectModel(BlogModel.name)
    protected readonly BlogModel: Model<BlogModelType>,
  ) {}

  async findBlogName(blogID: string): Promise<null | string> {
    const findBlog: null | BlogModelType =
      await this.blogRepository.findBlogById(blogID);

    if (!findBlog) {
      return null;
    }

    return findBlog.name;
  }

  async createBlog(blogDTO: CreateBlogDto): Promise<mongoID> {
    const createBlogSmart: BlogModelType = await new this.BlogModel(blogDTO);

    await this.blogRepository.save(createBlogSmart);

    return createBlogSmart._id;
  }

  async updateBlog(blogID: string, blogDTO: UpdateBlogDto) {
    const findBlog: BlogModelType | null =
      await this.blogRepository.findBlogById(blogID);

    if (!findBlog) {
      throw new NotFoundException();
    }

    await findBlog.updateBlog(blogDTO);

    await this.blogRepository.save(findBlog);
  }

  async deleteBlog(blogID: string) {
    const findBlog: BlogModelType = await this.blogRepository.findBlogById(
      blogID,
    );

    if (!findBlog) {
      throw new NotFoundException();
    }

    await this.blogRepository.deleteBlog(blogID);
  }

  async deleteAllBlogs() {
    await this.blogRepository.deleteAllBlogs();
  }
  async createPostOfBlog(
    blogID: string,
    postDTO: CreatePostOfBlogDto,
  ): Promise<GetPostDto> {
    const blogName: string | null = await this.findBlogName(blogID);

    if (!blogName) {
      throw new NotFoundException();
    }

    const newPostDTO: CreatePostDto = {
      ...postDTO,
      blogId: blogID,
      blogName: blogName,
    };

    return await this.postsService.createPostOfBlog(newPostDTO);
  }

  async getAllPostsOfBlog(
    blogID: string,
    queryAll: QueryPostDto,
  ): Promise<GetAllPostsDto> {
    const blogName: string | null = await this.findBlogName(blogID);

    if (!blogName) {
      throw new NotFoundException();
    }

    return await this.postsService.getAllPostsOfBlog(blogID, queryAll);
  }
}
