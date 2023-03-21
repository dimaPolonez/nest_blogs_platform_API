import { findBlog, trimDecorator } from '../../../validation';
import { IsMongoId, IsNotEmpty, Length, Validate } from 'class-validator';
import { CreatePostOfBlogType } from '../models';

export class CreatePostOfBlogDto implements CreatePostOfBlogType {
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