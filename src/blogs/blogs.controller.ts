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
} from '@nestjs/common';
import { mongoID } from 'src/models';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './repository/blogs.query-repository';
import {
  CreateBlogDto,
  CreatePostOfBlogDto,
  GetAllBlogsDto,
  GetBlogDto,
  UpdateBlogDto,
  QueryBlogsDto,
} from './dto';
import { GetAllPostsDto, GetPostDto, QueryPostDto } from '../posts/dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogService: BlogsService,
    protected blogQueryRepository: BlogsQueryRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() blogDTO: CreateBlogDto) /*: Promise<GetBlogDto>*/ {
    const newBlogID: mongoID = await this.blogService.createBlog(blogDTO);

    return await this.blogQueryRepository.findBlogById(newBlogID);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') blogID: string,
    @Body() blogDTO: UpdateBlogDto,
  ) {
    await this.blogService.updateBlog(blogID, blogDTO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') blogID: string) {
    await this.blogService.deleteBlog(blogID);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOneBlog(@Param('id') blogID: string): Promise<GetBlogDto> {
    return await this.blogQueryRepository.findBlogById(blogID);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllBlogs(@Query() queryAll: QueryBlogsDto): Promise<GetAllBlogsDto> {
    return await this.blogQueryRepository.getAllBlogs(queryAll);
  }

  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPostOfBlog(
    @Param('id') blogID: string,
    @Body() postDTO: CreatePostOfBlogDto,
  ): Promise<GetPostDto> {
    return await this.blogService.createPostOfBlog(blogID, postDTO);
  }
  @Get(':id/posts')
  @HttpCode(HttpStatus.OK)
  async getAllPostsOfBlog(
    @Param('id') blogID: string,
    @Query() queryAll: QueryPostDto,
  ): Promise<GetAllPostsDto> {
    return await this.blogService.getAllPostsOfBlog(blogID, queryAll);
  }
}
