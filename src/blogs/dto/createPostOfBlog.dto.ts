import { trim } from '../../helpers';
import { IsNotEmpty, Length } from 'class-validator';

export class CreatePostOfBlogDto {
  @trim()
  @Length(1, 30)
  @IsNotEmpty()
  readonly title: string;

  @trim()
  @Length(1, 100)
  @IsNotEmpty()
  readonly shortDescription: string;

  @trim()
  @Length(1, 1000)
  @IsNotEmpty()
  readonly content: string;

  blogId?: string;

  blogName?: string;
}
