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

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogService: BlogsService,
    protected blogQueryRepository: BlogsQueryRepository,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOneBlog(@Param('id') blogID: string): Promise<GetBlogType> {
    return await this.blogQueryRepository.findBlogById(blogID);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllBlogs(
    @Query() queryAll: QueryBlogsDto,
  ): Promise<GetAllBlogsType> {
    return await this.blogQueryRepository.getAllBlogs(queryAll);
  }

  @UseGuards(BasicAuthGuard)
  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPostOfBlog(
    @Param('id') blogID: string,
    @Body() postDTO: CreatePostOfBlogDto,
  ): Promise<GetPostOfBlogType> {
    return await this.blogService.createPostOfBlog({
      ...postDTO,
      blogId: blogID,
    });
  }
  @UseGuards(QuestJwtAccessGuard)
  @Get(':id/posts')
  @HttpCode(HttpStatus.OK)
  async getAllPostsOfBlog(
    @Request() req,
    @Param('id') blogID: string,
    @Query() queryAll: QueryPostOfBlogDto,
  ): Promise<GetAllPostsOfBlogType> {
    return await this.blogService.getAllPostsOfBlog(
      req.user.userID,
      blogID,
      queryAll,
    );
  }
}
