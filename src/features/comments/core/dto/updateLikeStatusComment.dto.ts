import { MyLikeStatus, UpdateLikeStatusCommentType } from '../models';
import { trimDecorator } from '../../../../validation';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateLikeStatusCommentDto implements UpdateLikeStatusCommentType {
  @trimDecorator()
  @IsNotEmpty()
  @IsEnum(MyLikeStatus)
  readonly likeStatus: MyLikeStatus;
}
