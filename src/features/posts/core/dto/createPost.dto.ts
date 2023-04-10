import { IsMongoId, IsNotEmpty, Length, Validate } from 'class-validator';
import { findBlog, trimDecorator } from '../../../../validation';
import { CreatePostType } from '../models';

export class CreatePostDto implements CreatePostType {
  @trimDecorator()
  @Length(1, 30)
  @IsNotEmpty()
  readonly title: string;

  @trimDecorator()
  @Length(1, 100)
  @IsNotEmpty()
  readonly shortDescription: string;

  @trimDecorator()
  @Length(1, 1000)
  @IsNotEmpty()
  readonly content: string;

  @Validate(findBlog)
  @trimDecorator()
  @IsMongoId()
  @Length(24, 24)
  @IsNotEmpty()
  readonly blogId: string;
}
