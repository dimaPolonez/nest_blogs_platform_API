import { trim } from '../../helpers';
import { IsNotEmpty, Length } from 'class-validator';

export class UpdateBlogDto {
  @trim()
  @Length(1, 15)
  @IsNotEmpty()
  readonly name: string;

  @trim()
  @Length(1, 500)
  @IsNotEmpty()
  readonly description: string;

  @trim()
  @Length(1, 100)
  @IsNotEmpty()
  readonly websiteUrl: string;
}
