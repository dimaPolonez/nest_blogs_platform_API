import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './repository/comments.query-repository';
import { GetCommentDto } from './dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentService: CommentsService,
    protected commentQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOneComment(@Param('id') commentID: string): Promise<GetCommentDto> {
    const findComment: GetCommentDto | null =
      await this.commentQueryRepository.findCommentById(commentID);

    if (!findComment) {
      throw new NotFoundException();
    }

    return findComment;
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Param('id') commentID: string,
    @Body() commentDTO: UpdateCommentDto,
  ) {
    await this.commentService.updateComment(commentID, commentDTO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Param('id') commentID: string) {
    await this.commentService.deleteComment(commentID);
  }

  /*

  @Put(':id/like-status')
  likeStatusComment(
    @Param('id') commentID: string,
    @Body() commentBody: likeCommentBodyType,
  ) {
    return 'hello';
  }
*/
}
