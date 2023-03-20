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

import { PostsService } from './posts.service';
import { PostsQueryRepository } from './repository/posts.query-repository';
import {
  CreateCommentOfPostDto,
  CreatePostDto,
  QueryPostDto,
  UpdatePostDto,
  QueryCommentDto,
} from './dto';
import {
  BasicAuthGuard,
  JwtAccessGuard,
  QuestJwtAccessGuard,
} from '../../guards-handlers/guard';
import {
  GetAllCommentsOfPostType,
  GetAllPostsType,
  GetCommentOfPostType,
  GetPostType,
} from './models';

@Controller('posts')
export class PostsController {
  constructor(
    protected postService: PostsService,
    protected postQueryRepository: PostsQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() postDTO: CreatePostDto): Promise<GetPostType> {
    const newPostID: string = await this.postService.createPost(postDTO);

    return await this.postQueryRepository.findPostById(newPostID);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id') postID: string,
    @Body() postDTO: UpdatePostDto,
  ) {
    await this.postService.updatePost(postID, postDTO);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') postID: string) {
    await this.postService.deletePost(postID);
  }

  @UseGuards(QuestJwtAccessGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOnePost(
    @Request() req,
    @Param('id') postID: string,
  ): Promise<GetPostType> {
    return await this.postQueryRepository.findPostById(postID);
  }

  @UseGuards(QuestJwtAccessGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPosts(
    @Request() req,
    @Query() queryAll: QueryPostDto,
  ): Promise<GetAllPostsType> {
    return await this.postQueryRepository.getAllPosts(queryAll);
  }

  @UseGuards(JwtAccessGuard)
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  async createCommentOfPost(
    @Request() req,
    @Param('id') postID: string,
    @Body() commentDTO: CreateCommentOfPostDto,
  ): Promise<GetCommentOfPostType> {
    return await this.postService.createCommentOfPost(postID, commentDTO);
  }

  @UseGuards(QuestJwtAccessGuard)
  @Get(':id/comments')
  @HttpCode(HttpStatus.OK)
  async getAllCommentsOfPost(
    @Request() req,
    @Param('id') postID: string,
    @Query() queryAll: QueryCommentDto,
  ): Promise<GetAllCommentsOfPostType> {
    return await this.postService.getAllCommentsOfPost(postID, queryAll);
  }

  /*
  @UseGuards(JwtAccessGuard)
  @Put(':id/like-status')
  likeStatusPost(
    @Request() req,
    @Param('id') postID: string,
    @Body() postBody: likePostBodyType,
  ) {
    return 'hello';
  }
*/
}
