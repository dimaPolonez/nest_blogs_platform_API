import { IsNotEmpty, IsString, Length } from 'class-validator';
import { trim } from '../../../helpers';

export class CreateBlogDto {
  @trim()
  @Length(1, 15)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Length(1, 500)
  description: string;

  @IsNotEmpty()
  @Length(1, 100)
  websiteUrl: string;
}
