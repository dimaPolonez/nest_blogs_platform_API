import { trimDecorator } from '../../../validation';
import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import { UpdateBlogType } from '../../models';

export class UpdateBlogDto implements UpdateBlogType {
  @trimDecorator()
  @Length(1, 15)
  @IsNotEmpty()
  readonly name: string;

  @trimDecorator()
  @Length(1, 500)
  @IsNotEmpty()
  readonly description: string;

  @trimDecorator()
  @Length(1, 100)
  @IsUrl()
  @IsNotEmpty()
  readonly websiteUrl: string;
}
