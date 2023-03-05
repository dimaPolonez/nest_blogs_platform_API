import mongoose from 'mongoose';
import { GetBlogDTO } from './getBlog.dto';

export class GetAllBlogsDTO {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetBlogDTO[];
}
