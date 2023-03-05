export class QueryBlogDTO {
  searchNameTerm: string | null;
  sortBy: string | null;
  sortDirection: string | null;
  pageNumber: number | null;
  pageSize: number | null;
}
