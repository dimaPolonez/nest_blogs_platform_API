import { IsMongoId, IsNotEmpty, Length, Validate } from 'class-validator';
import { findBlogClassValidate, trimDecorator } from '../../../validation';
import { UpdatePostType } from '../models';

export class UpdatePostDto implements UpdatePostType {
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

  @Validate(findBlogClassValidate)
  @trimDecorator()
  @IsMongoId()
  @Length(24, 24)
  @IsNotEmpty()
  readonly blogId: string;
}
