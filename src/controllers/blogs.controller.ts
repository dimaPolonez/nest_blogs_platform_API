import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../services';
import { BlogsQueryRepository } from '../repositories';
import { CreateBlogDto, QueryBlogDto, UpdateBlogDto } from '../core/dtos';
import { mongoID } from 'src/core/models';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogService: BlogsService,
    protected blogQueryRepository: BlogsQueryRepository,
  ) {}
  @Post()
  @HttpCode(201)
  async createBlog(@Body() blogDTO: CreateBlogDto) {
    const newBlogID: mongoID = await this.blogService.createBlog(blogDTO);

    return await this.blogQueryRepository.findBlogById(newBlogID);
  }

  @Post(':id/posts')
  @HttpCode(201)
  createPostOfBlog(
    @Param('id') blogID: string,
    //   @Body() postBody: createPostOfBlogBodyType,
  ) {
    return 'hello';
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogID: string,
    @Body() blogDTO: UpdateBlogDto,
  ) {
    await this.blogService.updateBlog(blogID, blogDTO);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') blogID: string) {
    await this.blogService.deleteBlog(blogID);
  }
  @Get()
  @HttpCode(200)
  async getAllBlogs(@Query() queryAll: QueryBlogDto) {
    return await this.blogQueryRepository.getAllBlogs(queryAll);
  }
  @Get(':id')
  @HttpCode(200)
  async getOneBlog(@Param('id') blogID: string) {
    return await this.blogQueryRepository.findBlogById(blogID);
  }

  @Get(':id/posts')
  @HttpCode(200)
  getAllPostsOfBlog(@Param('id') blogID: string) {
    return 'hello';
  }
}
