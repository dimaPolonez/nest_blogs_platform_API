import { IsNotEmpty, Length } from 'class-validator';
import { trimDecorator } from '../../../validation';
import { UpdateCommentType } from '../models';

export class UpdateCommentDto implements UpdateCommentType {
  @trimDecorator()
  @Length(20, 300)
  @IsNotEmpty()
  readonly content: string;
}
