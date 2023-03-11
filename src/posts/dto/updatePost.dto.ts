import { trim } from '../../helpers';
import { IsNotEmpty, Length } from 'class-validator';
import { isMongo } from '../../helpers/isMongoDecorator';

export class UpdatePostDto {
  @trim()
  @Length(1, 30)
  @IsNotEmpty()
  title: string;

  @trim()
  @Length(1, 100)
  @IsNotEmpty()
  shortDescription: string;

  @trim()
  @Length(1, 1000)
  @IsNotEmpty()
  content: string;

  @trim()
  @isMongo()
  @Length(24, 24)
  @IsNotEmpty()
  blogId: string;

  blogName?: string;
}
