import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { likeCommentBodyType, updateCommentBodyType } from './comment.model';
import { CommentService } from './comment.service';
import { CommentQueryRepository } from './commentQuery.repository';

@Controller('comments')
export class CommentController {
  constructor(
    protected commentService: CommentService,
    protected commentQueryRepository: CommentQueryRepository,
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
