import { Type } from 'class-transformer';
import { Min } from 'class-validator';
import { QueryType } from '../../../models/all.model';

export class QueryPostDto implements QueryType {
  readonly sortBy = 'createdAt';
  readonly sortDirection = 'desc';
  @Min(1)
  @Type(() => Number)
  readonly pageNumber = 1;
  @Min(1)
  @Type(() => Number)
  readonly pageSize = 10;
}
