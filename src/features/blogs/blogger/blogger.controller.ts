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
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../repository/blogs.query-repository';
import { JwtAccessGuard } from '../../../guards-handlers/guard';
import {
  CreateBlogDto,
  CreatePostOfBlogDto,
  QueryBlogsDto,
  UpdateBlogDto,
} from '../core/dto';
import {
  GetAllBlogsType,
  GetBlogType,
  GetPostOfBlogType,
} from '../core/models';
import { CreateBlogToBloggerCommand } from '../application/use-cases/create-blog-to-blogger-use-case';
import { UpdateBlogToBloggerCommand } from '../application/use-cases/update-blog-to-blogger-use-case';
import { DeleteBlogToBloggerCommand } from '../application/use-cases/delete-blog-to-blogger-use-case';
import { CreatePostOfBlogToBloggerCommand } from '../../posts/application/use-cases/create-post-of-blog-use-case';
import { PostsQueryRepository } from '../../posts/repository/posts.query-repository';
import { UpdatePostOfBlogDto } from '../core/dto/updatePostOfBlog.dto';
import { UpdatePostOfBlogToBloggerCommand } from '../../posts/application/use-cases/update-post-of-blog-use-case';
import { DeletePostOfBlogToBloggerCommand } from '../../posts/application/use-cases/delete-post-of-blog-use-case';

@Controller('blogger')
export class BloggerController {
  constructor(
    protected commandBus: CommandBus,
    protected blogService: BlogsService,
    protected blogQueryRepository: BlogsQueryRepository,
    protected postQueryRepository: PostsQueryRepository,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(
    @Body() blogDTO: CreateBlogDto,
    @Request() req,
  ): Promise<GetBlogType> {
    try {
      const newBlogID: string = await this.commandBus.execute(
        new CreateBlogToBloggerCommand(req.user.userID, blogDTO),
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
    @Request() req,
  ) {
    try {
      await this.commandBus.execute(
        new UpdateBlogToBloggerCommand(req.user.userID, blogID, blogDTO),
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
  async deleteBlog(@Param('id') blogID: string, @Request() req) {
    try {
      await this.commandBus.execute(
        new DeleteBlogToBloggerCommand(req.user.userID, blogID),
      );
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
    @Request() req,
  ): Promise<GetAllBlogsType> {
    return await this.blogQueryRepository.getAllBlogsToBlogger(
      req.user.userID,
      queryAll,
    );
  }

  @UseGuards(JwtAccessGuard)
  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPostOfBlog(
    @Param('id') blogID: string,
    @Body() postDTO: CreatePostOfBlogDto,
    @Request() req,
  ): Promise<GetPostOfBlogType> {
    try {
      const newPostOfBlogID: string = await this.commandBus.execute(
        new CreatePostOfBlogToBloggerCommand(req.user.userID, blogID, postDTO),
      );

      return await this.postQueryRepository.findPostById(newPostOfBlogID);
    } catch (err) {
      throw new HttpException(
        { message: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAccessGuard)
  @Post(':idBlog/posts/:idPost')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostOfBlog(
    @Param('idBlog') blogID: string,
    @Param('idPost') postID: string,
    @Body() postDTO: UpdatePostOfBlogDto,
    @Request() req,
  ) {
    try {
      await this.commandBus.execute(
        new UpdatePostOfBlogToBloggerCommand(
          req.user.userID,
          blogID,
          postID,
          postDTO,
        ),
      );
    } catch (err) {
      throw new HttpException(
        { message: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAccessGuard)
  @Post(':idBlog/posts/:idPost')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostOfBlog(
    @Param('idBlog') blogID: string,
    @Param('idPost') postID: string,
    @Request() req,
  ) {
    try {
      await this.commandBus.execute(
        new DeletePostOfBlogToBloggerCommand(req.user.userID, blogID, postID),
      );
    } catch (err) {
      throw new HttpException(
        { message: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
