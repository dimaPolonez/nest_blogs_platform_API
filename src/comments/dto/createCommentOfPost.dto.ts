import { trim } from '../../helpers';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateCommentOfPostDto {
  @trim()
  @Length(20, 300)
  @IsNotEmpty()
  content: string;
}
