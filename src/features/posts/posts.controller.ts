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

import { mongoID } from '../../models';
import { PostsService } from './posts.service';
import { PostsQueryRepository } from './repository/posts.query-repository';
import {
  CreatePostDto,
  GetAllPostsDto,
  GetPostDto,
  QueryPostDto,
  UpdatePostDto,
} from './dto';
import {
  GetCommentDto,
  QueryCommentDto,
  CreateCommentOfPostDto,
  GetAllCommentsDto,
} from '../comments/dto';
import {
  BasicAuthGuard,
  JwtAccessGuard,
  QuestJwtAccessGuard,
} from '../../auth/guard';

@Controller('posts')
export class PostsController {
  constructor(
    protected postService: PostsService,
    protected postQueryRepository: PostsQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() postDTO: CreatePostDto): Promise<GetPostDto> {
    const newPostID: mongoID = await this.postService.createPost(postDTO);

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
  ): Promise<GetPostDto> {
    return await this.postQueryRepository.findPostById(postID);
  }

  @UseGuards(QuestJwtAccessGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPosts(
    @Request() req,
    @Query() queryAll: QueryPostDto,
  ): Promise<GetAllPostsDto> {
    return await this.postQueryRepository.getAllPosts(queryAll);
  }

  @UseGuards(JwtAccessGuard)
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  async createCommentOfPost(
    @Request() req,
    @Param('id') postID: string,
    @Body() commentDTO: CreateCommentOfPostDto,
  ): Promise<GetCommentDto> {
    return await this.postService.createCommentOfPost(postID, commentDTO);
  }

  @UseGuards(QuestJwtAccessGuard)
  @Get(':id/comments')
  @HttpCode(HttpStatus.OK)
  async getAllCommentsOfPost(
    @Request() req,
    @Param('id') postID: string,
    @Query() queryAll: QueryCommentDto,
  ): Promise<GetAllCommentsDto> {
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
