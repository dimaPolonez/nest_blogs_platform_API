export type GetBlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type MinimalBlog = {
  id: string;
};

type BlogOwnerType = {
  userId: string;
  userLogin: string;
};

type BanInfoType = {
  isBanned: boolean;
  banDate: string;
};

export type GetBlogAdminType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
  blogOwnerInfo: BlogOwnerType;
  banInfo: BanInfoType;
};

export type GetAllBlogsType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetBlogType[];
};

export type GetAllBlogsAdminType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetBlogAdminType[];
};
