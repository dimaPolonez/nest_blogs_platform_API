import { trimDecorator } from '../../../validation';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MyLikeStatus, UpdateLikeStatusPostType } from '../../models';

export class UpdateLikeStatusPostDto implements UpdateLikeStatusPostType {
  @trimDecorator()
  @IsNotEmpty()
  @IsEnum(MyLikeStatus)
  readonly likeStatus: MyLikeStatus;
}
