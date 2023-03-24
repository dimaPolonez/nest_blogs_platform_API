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
import { UpdateCommentDto } from './dto';
import {
  JwtAccessGuard,
  QuestJwtAccessGuard,
} from '../../guards-handlers/guard';
import { GetCommentType, MyLikeStatus } from './models';
import { UpdateLikeStatusCommentDto } from './dto/updateLikeStatusComment.dto';

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
  ) /*: Promise<GetCommentType>*/ {
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

  @UseGuards(JwtAccessGuard)
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async likeStatusComment(
    @Request() req,
    @Param('id') commentID: string,
    @Body() bodyLikeStatus: UpdateLikeStatusCommentDto,
  ) {
    await this.commentService.updateLikeStatusComment(
      req.user.userID,
      req.user.login,
      commentID,
      bodyLikeStatus.likeStatus,
    );
  }
}
