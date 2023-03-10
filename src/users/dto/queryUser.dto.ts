import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class QueryUserDto {
  searchLoginTerm = '';
  searchEmailTerm = '';
  sortBy = 'createdAt';
  sortDirection = 'desc';
  @Min(1)
  @Type(() => Number)
  pageNumber = 1;
  @Min(1)
  @Type(() => Number)
  pageSize = 10;
}
