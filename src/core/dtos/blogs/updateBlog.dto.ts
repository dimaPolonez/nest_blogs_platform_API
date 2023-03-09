import { trim } from '../../../helpers';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateBlogDto {
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
