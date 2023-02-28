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
} from './post.model';
import { PostService } from './post.service';
import { PostQueryRepository } from './postQuery.repository';

@Controller('posts')
export class PostController {
  constructor(
    protected PostService: PostService,
    protected PostQueryRepository: PostQueryRepository,
  ) {}
  @Post()
  createPost(@Body() postBody: createPostBodyType) {
    return 'hello';
  }

  @Post(':id/comments')
  createCommentOfPost(
    @Param('id') postID: string,
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
