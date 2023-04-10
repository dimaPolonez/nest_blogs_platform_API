import { IsNotEmpty, Length } from 'class-validator';
import { trimDecorator } from '../../../../validation';
import { CreateCommentOfPostType } from '../models';

export class CreateCommentOfPostDto implements CreateCommentOfPostType {
  @trimDecorator()
  @Length(20, 300)
  @IsNotEmpty()
  readonly content: string;
}
