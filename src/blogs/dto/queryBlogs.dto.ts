import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class QueryBlogsDto {
  readonly searchNameTerm = '';
  readonly sortBy = 'createdAt';
  readonly sortDirection = 'desc';
  @Min(1)
  @Type(() => Number)
  readonly pageNumber = 1;
  @Min(1)
  @Type(() => Number)
  readonly pageSize = 10;
}
