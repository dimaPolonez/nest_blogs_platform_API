import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
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
    const findPost: GetPostDto | null =
      await this.postQueryRepository.findPostById(postID);

    if (!findPost) {
      throw new NotFoundException();
    }

    return findPost;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPosts(@Query() queryAll: QueryPostDto): Promise<GetAllPostsDto> {
    return await this.postQueryRepository.getAllPosts(queryAll);
  }

  /*  @Post(':id/comments')
  createCommentOfPost(
    @Param('id') postID: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() commentBody: createCommentOfPostBodyType,
  ) {
    return 'hello';
  }

  @Put(':id/like-status')
  likeStatusPost(
    @Param('id') postID: string,
    @Body() postBody: likePostBodyType,
  ) {
    return 'hello';
  }

  @Get(':id/comments')
  getAllCommentsOfPost(@Param('id') postID: string) {
    return 'hello';
  }*/
}
