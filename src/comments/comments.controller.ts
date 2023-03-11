import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  @HttpCode(200)
  async getOneComment(@Param('id') commentID: string): Promise<GetCommentDto> {
    const findComment: GetCommentDto | null =
      await this.commentQueryRepository.findCommentById(commentID);

    if (!findComment) {
      throw new NotFoundException();
    }

    return findComment;
  }

  @Put(':id')
  @HttpCode(204)
  async updateComment(
    @Param('id') commentID: string,
    @Body() commentDTO: UpdateCommentDto,
  ) {
    await this.commentService.updateComment(commentID, commentDTO);
  }

  @Delete(':id')
  @HttpCode(204)
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
