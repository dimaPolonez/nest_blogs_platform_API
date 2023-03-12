import { trim } from '../../helpers';
import { IsNotEmpty, Length } from 'class-validator';

export class CreatePostOfBlogDto {
  @trim()
  @Length(1, 30)
  @IsNotEmpty()
  title: string;

  @trim()
  @Length(1, 100)
  @IsNotEmpty()
  shortDescription: string;

  @trim()
  @Length(1, 1000)
  @IsNotEmpty()
  content: string;

  blogId?: string;

  blogName?: string;
}
