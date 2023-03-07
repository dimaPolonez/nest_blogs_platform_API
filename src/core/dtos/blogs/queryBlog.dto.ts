export class QueryBlogDto {
  searchNameTerm: string | null;
  sortBy: string | null;
  sortDirection: string | null;
  pageNumber: number | null;
  pageSize: number | null;
}
