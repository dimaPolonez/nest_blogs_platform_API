import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './repository/comments.query-repository';
import { GetCommentDto, UpdateCommentDto } from './dto';
import { JwtAccessGuard, QuestJwtAccessGuard } from '../../auth/guard';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentService: CommentsService,
    protected commentQueryRepository: CommentsQueryRepository,
  ) {}

  @UseGuards(QuestJwtAccessGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOneComment(
    @Request() req,
    @Param('id') commentID: string,
  ): Promise<GetCommentDto> {
    return await this.commentQueryRepository.findCommentById(commentID);
  }

  @UseGuards(JwtAccessGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Request() req,
    @Param('id') commentID: string,
    @Body() commentDTO: UpdateCommentDto,
  ) {
    await this.commentService.updateComment(commentID, commentDTO);
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Request() req, @Param('id') commentID: string) {
    await this.commentService.deleteComment(commentID);
  }

  /*
  @UseGuards(JwtAccessGuard)
  @Put(':id/like-status')
  likeStatusComment(
    @Request() req,
    @Param('id') commentID: string,
    @Body() commentBody: likeCommentBodyType,
  ) {
    return 'hello';
  }
*/
}
