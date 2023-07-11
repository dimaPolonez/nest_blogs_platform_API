import { CommandBus } from '@nestjs/cqrs';
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
import { BlogsQueryRepository } from '../../public/blogs/repository/blogs.query-repository';
import { JwtAccessGuard } from '../../guards-handlers/guard';
import {
  CreateBlogDto,
  CreatePostOfBlogDto,
  QueryBlogsDto,
  UpdateBlogDto,
} from '../../core/dto/blogs';
import {
  GetAllBlogsType,
  GetBlogType,
  GetPostOfBlogType,
} from '../../core/models';
import { CreateBlogToBloggerCommand } from './use-cases/create-blog-to-blogger-use-case';
import { UpdateBlogToBloggerCommand } from './use-cases/update-blog-to-blogger-use-case';
import { DeleteBlogToBloggerCommand } from './use-cases/delete-blog-to-blogger-use-case';
import { CreatePostOfBlogToBloggerCommand } from './use-cases/create-post-of-blog-use-case';
import { PostsQueryRepository } from '../../public/posts/repository/posts.query-repository';
import { UpdatePostOfBlogDto } from '../../core/dto/blogs/updatePostOfBlog.dto';
import { UpdatePostOfBlogToBloggerCommand } from './use-cases/update-post-of-blog-use-case';
import { DeletePostOfBlogToBloggerCommand } from './use-cases/delete-post-of-blog-use-case';

@Controller('blogger')
export class BloggerController {
  constructor(
    protected commandBus: CommandBus,
    protected blogQueryRepository: BlogsQueryRepository,
    protected postQueryRepository: PostsQueryRepository,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Post('blogs')
  @HttpCode(HttpStatus.CREATED)
  async createBlog(
    @Body() blogDTO: CreateBlogDto,
    @Request() req,
  ): Promise<GetBlogType> {
    const newBlogID: string = await this.commandBus.execute(
      new CreateBlogToBloggerCommand(req.user.userID, blogDTO),
    );
    return await this.blogQueryRepository.findBlogById(newBlogID);
  }

  @UseGuards(JwtAccessGuard)
  @Put('blogs/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') blogID: string,
    @Body() blogDTO: UpdateBlogDto,
    @Request() req,
  ) {
    await this.commandBus.execute(
      new UpdateBlogToBloggerCommand(req.user.userID, blogID, blogDTO),
    );
  }

  @UseGuards(JwtAccessGuard)
  @Delete('blogs/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') blogID: string, @Request() req) {
    await this.commandBus.execute(
      new DeleteBlogToBloggerCommand(req.user.userID, blogID),
    );
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
  @Post('blogs/:id/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPostOfBlog(
    @Param('id') blogID: string,
    @Body() postDTO: CreatePostOfBlogDto,
    @Request() req,
  ): Promise<GetPostOfBlogType> {
    const newPostOfBlogID: string = await this.commandBus.execute(
      new CreatePostOfBlogToBloggerCommand(req.user.userID, blogID, postDTO),
    );

    return await this.postQueryRepository.findPostById(newPostOfBlogID);
  }

  @UseGuards(JwtAccessGuard)
  @Post('blogs/:idBlog/posts/:idPost')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostOfBlog(
    @Param('idBlog') blogID: string,
    @Param('idPost') postID: string,
    @Body() postDTO: UpdatePostOfBlogDto,
    @Request() req,
  ) {
    await this.commandBus.execute(
      new UpdatePostOfBlogToBloggerCommand(
        req.user.userID,
        blogID,
        postID,
        postDTO,
      ),
    );
  }

  @UseGuards(JwtAccessGuard)
  @Post('blogs/:idBlog/posts/:idPost')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostOfBlog(
    @Param('idBlog') blogID: string,
    @Param('idPost') postID: string,
    @Request() req,
  ) {
    await this.commandBus.execute(
      new DeletePostOfBlogToBloggerCommand(req.user.userID, blogID, postID),
    );
  }
}
