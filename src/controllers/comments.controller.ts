import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { likeCommentBodyType, updateCommentBodyType } from '../core/models';
import { CommentsService } from '../services';
import { CommentsQueryRepository } from '../repositories';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentService: CommentsService,
    protected commentQueryRepository: CommentsQueryRepository,
  ) {}
  @Put(':id')
  updateComment(
    @Param('id') commentID: string,
    @Body() commentBody: updateCommentBodyType,
  ) {
    return 'hello';
  }

  @Put(':id/like-status')
  likeStatusComment(
    @Param('id') commentID: string,
    @Body() commentBody: likeCommentBodyType,
  ) {
    return 'hello';
  }

  @Delete(':id')
  deleteComment(@Param('id') commentID: string) {
    return 'hello';
  }

  @Get(':id')
  getOneComment(@Param('id') commentID: string) {
    return 'hello';
  }
}
