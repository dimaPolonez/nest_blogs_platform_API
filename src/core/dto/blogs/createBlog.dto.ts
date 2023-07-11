import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import { trimDecorator } from '../../../validation';
import { CreateBlogType } from '../../models';

export class CreateBlogDto implements CreateBlogType {
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
