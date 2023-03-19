import { IsMongoId, IsNotEmpty, Length } from 'class-validator';
import { trim } from '../../../validation';

export class CreatePostDto {
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

  @trim()
  @IsMongoId()
  @Length(24, 24)
  @IsNotEmpty()
  readonly blogId: string;

  blogName?: string;
}
