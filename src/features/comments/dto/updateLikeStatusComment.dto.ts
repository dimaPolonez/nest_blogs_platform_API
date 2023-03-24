import { MyLikeStatus, UpdateLikeStatusCommentType } from '../models';
import { trimDecorator } from '../../../validation';
import { IsNotEmpty } from 'class-validator';

export class UpdateLikeStatusCommentDto implements UpdateLikeStatusCommentType {
  @trimDecorator()
  @IsNotEmpty()
  readonly likeStatus: MyLikeStatus;
}
