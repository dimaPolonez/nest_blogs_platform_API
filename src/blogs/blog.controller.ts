import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  createBlogBodyType,
  createPostOfBlogBodyType,
  updateBlogBodyType,
} from './blog.model';
import { BlogService } from './blog.service';
import { BlogQueryRepository } from './blogQuery.repository';

@Controller('blogs')
export class BlogController {
  constructor(
    protected BlogService: BlogService,
    protected BlogQueryRepository: BlogQueryRepository,
  ) {}
  @Post()
  createBlog(@Body() blogBody: createBlogBodyType) {
    return 'hello';
  }

  @Post(':id/posts')
  createPostOfBlog(
    @Param('id') blogID: string,
    @Body() postBody: createPostOfBlogBodyType,
  ) {
    return 'hello';
  }

  @Put(':id')
  updateBlog(
    @Param('id') blogID: string,
    @Body() blogBody: updateBlogBodyType,
  ) {
    return 'hello';
  }

  @Delete(':id')
  deleteBlog(@Param('id') blogID: string) {
    return 'hello';
  }
  @Get()
  getAllBlogs() {
    return 'hello';
  }
  @Get(':id')
  getOneBlog(@Param('id') blogID: string) {
    return 'hello';
  }

  @Get(':id/posts')
  getAllPostsOfBlog(@Param('id') blogID: string) {
    return 'hello';
  }
}
