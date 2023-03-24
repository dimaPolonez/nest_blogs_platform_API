export type CreateBlogType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type CreatePostOfBlogType = {
  title: string;
  shortDescription: string;
  content: string;
};

export type CreatePostOfBlogAllType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
};

export type UpdateBlogType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type QueryBlogType = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};

export type QueryPostOfBlogType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};
