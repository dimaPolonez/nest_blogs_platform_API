import { Transform } from 'class-transformer';

export class QueryPostDto {
  @Transform(({ value }) => (value ? value : 'createdAt'))
  sortBy: string | null;
  @Transform(({ value }) => (value ? value : 'desc'))
  sortDirection: string | null;
  @Transform(({ value }) => (value ? Number(value) : 1))
  pageNumber: number | null;
  @Transform(({ value }) => (value ? Number(value) : 10))
  pageSize: number | null;
}
