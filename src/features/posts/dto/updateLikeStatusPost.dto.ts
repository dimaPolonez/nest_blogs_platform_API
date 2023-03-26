import { MyLikeStatus, UpdateLikeStatusPostType } from '../models';
import { trimDecorator } from '../../../validation';
import { IsNotEmpty } from 'class-validator';

export class UpdateLikeStatusPostDto implements UpdateLikeStatusPostType {
  @trimDecorator()
  @IsNotEmpty()
  readonly likeStatus: MyLikeStatus;
}
