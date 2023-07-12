import { trimDecorator } from '../../../validation';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MyLikeStatus, UpdateLikeStatusCommentType } from '../../models';

export class UpdateLikeStatusCommentDto implements UpdateLikeStatusCommentType {
  @trimDecorator()
  @IsNotEmpty()
  @IsEnum(MyLikeStatus)
  readonly likeStatus: MyLikeStatus;
}
