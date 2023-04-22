import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './application/blogs.service';
import { BlogsQueryRepository } from './repository/blogs.query-repository';
import {
  CreateBlogDto,
  CreatePostOfBlogDto,
  QueryBlogsDto,
  UpdateBlogDto,
  QueryPostOfBlogDto,
} from './core/dto';
import {
  BasicAuthGuard,
  QuestJwtAccessGuard,
} from '../../guards-handlers/guard';
import {
  GetAllBlogsType,
  GetAllPostsOfBlogType,
  GetBlogType,
  GetPostOfBlogType,
} from './core/models';
import { PostsQueryRepository } from '../posts/repository/posts.query-repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected postQueryRepository: PostsQueryRepository,
    protected blogQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllBlogs(
    @Query() queryAll: QueryBlogsDto,
  ): Promise<GetAllBlogsType> {
    return await this.blogQueryRepository.getAllBlogs(queryAll);
  }

  @UseGuards(QuestJwtAccessGuard)
  @Get(':id/posts')
  @HttpCode(HttpStatus.OK)
  async getAllPostsOfBlog(
    @Request() req,
    @Param('id') blogID: string,
    @Query() queryAll: QueryPostOfBlogDto,
  ): Promise<GetAllPostsOfBlogType> {
    return await this.postQueryRepository.getAllPosts(
      req.user.userID,
      queryAll,
      blogID,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOneBlog(@Param('id') blogID: string): Promise<GetBlogType> {
    return await this.blogQueryRepository.findBlogById(blogID);
  }
}
