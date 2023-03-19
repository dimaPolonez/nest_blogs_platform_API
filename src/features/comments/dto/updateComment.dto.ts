import { IsNotEmpty, Length } from 'class-validator';
import { trim } from '../../../validation';

export class UpdateCommentDto {
  @trim()
  @Length(20, 300)
  @IsNotEmpty()
  readonly content: string;
}
