import { trim } from '../../../validation';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateCommentOfPostDto {
  @trim()
  @Length(20, 300)
  @IsNotEmpty()
  readonly content: string;
}
