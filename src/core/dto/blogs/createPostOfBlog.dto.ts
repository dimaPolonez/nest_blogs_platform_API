import { trimDecorator } from '../../../validation';
import { IsNotEmpty, Length } from 'class-validator';
import { CreatePostOfBlogType } from '../../models';

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
}
