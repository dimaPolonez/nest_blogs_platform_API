import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './repository/comments.query-repository';
import { GetCommentDto, UpdateCommentDto } from './dto';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentService: CommentsService,
    protected commentQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOneComment(@Param('id') commentID: string): Promise<GetCommentDto> {
    return await this.commentQueryRepository.findCommentById(commentID);
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
