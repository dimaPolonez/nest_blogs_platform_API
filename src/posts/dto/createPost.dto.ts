import { IsMongoId, IsNotEmpty, Length } from 'class-validator';
import { trim } from '../../helpers';

export class CreatePostDto {
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

  @trim()
  @IsMongoId()
  @Length(24, 24)
  @IsNotEmpty()
  blogId: string;

  blogName?: string;
}
