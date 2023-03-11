import { Transform } from 'class-transformer';

export class QueryBlogsDto {
  @Transform(({ value }) => (value ? value : ''))
  searchNameTerm?: string;
  @Transform(({ value }) => (value ? value : 'createdAt'))
  sortBy?: string;
  @Transform(({ value }) => (value ? value : 'desc'))
  sortDirection?: string;
  @Transform(({ value }) => (value ? Number(value) : 1))
  pageNumber?: number;
  @Transform(({ value }) => (value ? Number(value) : 10))
  pageSize?: number;
}
