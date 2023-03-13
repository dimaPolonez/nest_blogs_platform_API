import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class QueryUserDto {
  readonly searchLoginTerm = '';
  readonly searchEmailTerm = '';
  readonly sortBy = 'createdAt';
  readonly sortDirection = 'desc';
  @Min(1)
  @Type(() => Number)
  readonly pageNumber = 1;
  @Min(1)
  @Type(() => Number)
  readonly pageSize = 10;
}
