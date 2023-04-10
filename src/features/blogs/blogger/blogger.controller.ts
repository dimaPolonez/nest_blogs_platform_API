import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../repository/blogs.query-repository';
import { JwtAccessGuard } from '../../../guards-handlers/guard';
import { CreateBlogDto, QueryBlogsDto, UpdateBlogDto } from '../core/dto';
import { GetAllBlogsType, GetBlogType } from '../core/models';
import { CreateBlogToBloggerCommand } from '../application/use-cases/create-blog-to-blogger-use-case';
import { UpdateBlogToBloggerCommand } from '../application/use-cases/update-blog-to-blogger-use-case';
import { DeleteBlogToBloggerCommand } from '../application/use-cases/delete-blog-to-blogger-use-case';

@Controller('blogger')
export class BloggerController {
  constructor(
    protected commandBus: CommandBus,
    protected blogService: BlogsService,
    protected blogQueryRepository: BlogsQueryRepository,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() blogDTO: CreateBlogDto): Promise<GetBlogType> {
    try {
      const newBlogID: string = await this.commandBus.execute(
        new CreateBlogToBloggerCommand(blogDTO),
      );

      return await this.blogQueryRepository.findBlogById(newBlogID);
    } catch (err) {
      throw new HttpException(
        { message: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAccessGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') blogID: string,
    @Body() blogDTO: UpdateBlogDto,
  ) {
    try {
      await this.commandBus.execute(
        new UpdateBlogToBloggerCommand(blogID, blogDTO),
      );
    } catch (err) {
      throw new HttpException(
        { message: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') blogID: string) {
    try {
      await this.commandBus.execute(new DeleteBlogToBloggerCommand(blogID));
    } catch (err) {
      throw new HttpException(
        { message: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @UseGuards(JwtAccessGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllBlogsToBlogger(
    @Query() queryAll: QueryBlogsDto,
  ): Promise<GetAllBlogsType> {
    return await this.blogQueryRepository.getAllBlogsToBlogger(queryAll);
  }

  @UseGuards(JwtAccessGuard)
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
}
