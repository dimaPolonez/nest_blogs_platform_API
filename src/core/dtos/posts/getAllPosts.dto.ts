import mongoose from 'mongoose';
import { GetPostDto } from './getPost.dto';

export class GetAllPostsDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetPostDto[];
}
