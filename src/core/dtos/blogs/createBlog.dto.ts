import { IsString } from 'class-validator';

export class CreateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}
