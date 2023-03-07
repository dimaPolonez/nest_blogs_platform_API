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
  createCommentOfPostBodyType,
  createPostBodyType,
  likePostBodyType,
  updatePostBodyType,
} from '../core/models';
import { PostsService } from '../services';
import { PostsQueryRepository } from '../repositories';
import { CreatePostDto } from '../core/dtos';
import { mongoID } from '../core/models';

@Controller('posts')
export class PostsController {
  constructor(
    protected postService: PostsService,
    protected postQueryRepository: PostsQueryRepository,
  ) {}
  @Post()
  async createPost(@Body() postDTO: CreatePostDto) {
    const newPostID: mongoID = await this.postService.createPost(postDTO);
    return await this.postQueryRepository.findPostById(newPostID);
  }

  @Post(':id/comments')
  createCommentOfPost(
    @Param('id') postID: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() commentBody: createCommentOfPostBodyType,
  ) {
    return 'hello';
  }

  @Put(':id')
  updatePost(
    @Param('id') postID: string,
    @Body() postBody: updatePostBodyType,
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

  @Delete(':id')
  deletePost(@Param('id') postID: string) {
    return 'hello';
  }

  @Get()
  getAllPosts() {
    return 'hello';
  }

  @Get(':id')
  getOnePost(@Param('id') postID: string) {
    return 'hello';
  }

  @Get(':id/comments')
  getAllCommentsOfPost(@Param('id') postID: string) {
    return 'hello';
  }
}
