import { mongoID } from '../../models';

export class GetBlogDto {
  id: mongoID;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export class GetAllBlogsDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetBlogDto[];
}
