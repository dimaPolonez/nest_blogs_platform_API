import {
  MyLikeStatus,
  UpdateLikeStatusCommentType,
} from '../../../public/comments/core/models';
import { trimDecorator } from '../../../validation';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateLikeStatusCommentDto implements UpdateLikeStatusCommentType {
  @trimDecorator()
  @IsNotEmpty()
  @IsEnum(MyLikeStatus)
  readonly likeStatus: MyLikeStatus;
}
