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
import { createPostOfBlogBodyType } from './blog.model';
import { BlogService } from './blog.service';
import { BlogQueryRepository } from './blogQuery.repository';
import { BlogReqDTO } from './dto/blog.dto';
import { mongoID } from '../app.model';
import { BlogQueryAll } from './dto/getQueryBlog.dto';

@Controller('blogs')
export class BlogController {
  constructor(
    protected blogService: BlogService,
    protected blogQueryRepository: BlogQueryRepository,
  ) {}
  @Post()
  @HttpCode(201)
  async createBlog(@Body() blogDTO: BlogReqDTO) {
    const newBlogID: mongoID = await this.blogService.createBlog(blogDTO);

    return await this.blogQueryRepository.findBlogById(newBlogID);
  }

  @Post(':id/posts')
  @HttpCode(201)
  createPostOfBlog(
    @Param('id') blogID: string,
    @Body() postBody: createPostOfBlogBodyType,
  ) {
    return 'hello';
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(@Param('id') blogID: string, @Body() blogDTO: BlogReqDTO) {
    await this.blogService.updateBlog(blogID, blogDTO);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') blogID: string) {
    await this.blogService.deleteBlog(blogID);
  }
  @Get()
  @HttpCode(200)
  async getAllBlogs(@Query() queryAll: BlogQueryAll) {
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
