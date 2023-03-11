import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
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
  GetAllBlogsDto,
  GetBlogDto,
  UpdateBlogDto,
} from './dto';
import { QueryBlogsDto } from './dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogService: BlogsService,
    protected blogQueryRepository: BlogsQueryRepository,
  ) {}
  @Post()
  @HttpCode(201)
  async createBlog(@Body() blogDTO: CreateBlogDto): Promise<GetBlogDto> {
    const newBlogID: mongoID = await this.blogService.createBlog(blogDTO);

    return await this.blogQueryRepository.findBlogById(newBlogID);
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

  @Get(':id')
  @HttpCode(200)
  async getOneBlog(@Param('id') blogID: string): Promise<GetBlogDto> {
    const findBlog: GetBlogDto | null =
      await this.blogQueryRepository.findBlogById(blogID);

    if (!findBlog) {
      throw new NotFoundException();
    }

    return findBlog;
  }
  @Get()
  @HttpCode(200)
  async getAllBlogs(@Query() queryAll: QueryBlogsDto): Promise<GetAllBlogsDto> {
    return await this.blogQueryRepository.getAllBlogs(queryAll);
  }

  /*  @Post(':id/posts')
  @HttpCode(201)
  createPostOfBlog(
    @Param('id') blogID: string,
    //   @Body() postBody: createPostOfBlogBodyType,
  ) {
    return 'hello';
  }

  @Get(':id/posts')
  @HttpCode(200)
  getAllPostsOfBlog(@Param('id') blogID: string) {
    return 'hello';
  }*/
}
