import mongoose from 'mongoose';
import { GetBlogResDTO } from './getBlog.dto';

export class BlogQueryAll {
  searchNameTerm: string | null;
  sortBy: string | null;
  sortDirection: string | null;
  pageNumber: number | null;
  pageSize: number | null;
}

export class BlogGetAllRes {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetBlogResDTO[];
}
