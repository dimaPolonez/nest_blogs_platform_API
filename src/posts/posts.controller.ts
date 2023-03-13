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
} from '@nestjs/common';

import { mongoID } from '../models';
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

@Controller('posts')
export class PostsController {
  constructor(
    protected postService: PostsService,
    protected postQueryRepository: PostsQueryRepository,
  ) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() postDTO: CreatePostDto): Promise<GetPostDto> {
    const newPostID: mongoID = await this.postService.createPost(postDTO);

    return await this.postQueryRepository.findPostById(newPostID);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id') postID: string,
    @Body() postDTO: UpdatePostDto,
  ) {
    await this.postService.updatePost(postID, postDTO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') postID: string) {
    await this.postService.deletePost(postID);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOnePost(@Param('id') postID: string): Promise<GetPostDto> {
    return await this.postQueryRepository.findPostById(postID);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPosts(@Query() queryAll: QueryPostDto): Promise<GetAllPostsDto> {
    return await this.postQueryRepository.getAllPosts(queryAll);
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  async createCommentOfPost(
    @Param('id') postID: string,
    @Body() commentDTO: CreateCommentOfPostDto,
  ): Promise<GetCommentDto> {
    return await this.postService.createCommentOfPost(postID, commentDTO);
  }

  @Get(':id/comments')
  @HttpCode(HttpStatus.OK)
  async getAllCommentsOfPost(
    @Param('id') postID: string,
    @Query() queryAll: QueryCommentDto,
  ): Promise<GetAllCommentsDto> {
    return await this.postService.getAllCommentsOfPost(postID, queryAll);
  }

  /*
  @Put(':id/like-status')
  likeStatusPost(
    @Param('id') postID: string,
    @Body() postBody: likePostBodyType,
  ) {
    return 'hello';
  }
*/
}
