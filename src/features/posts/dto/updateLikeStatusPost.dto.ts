import { MyLikeStatus, UpdateLikeStatusPostType } from '../models';
import { trimDecorator } from '../../../validation';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateLikeStatusPostDto implements UpdateLikeStatusPostType {
  @trimDecorator()
  @IsNotEmpty()
  @IsEnum(MyLikeStatus)
  readonly likeStatus: MyLikeStatus;
}
