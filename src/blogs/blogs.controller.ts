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
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogs.query-repository';
import { mongoID } from '../app.model';
import { CreateBlogDTO } from './dto/createBlog.dto';
import { UpdateBlogDTO } from './dto/updateBlog.dto';
import { GetAllBlogsDTO } from './dto/getAllBlogs.dto';
import { QueryBlogDTO } from './dto/queryBlog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogService: BlogsService,
    protected blogQueryRepository: BlogsQueryRepository,
  ) {}
  @Post()
  @HttpCode(201)
  async createBlog(@Body() blogDTO: CreateBlogDTO) {
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
    @Body() blogDTO: UpdateBlogDTO,
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
  async getAllBlogs(@Query() queryAll: QueryBlogDTO) {
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
