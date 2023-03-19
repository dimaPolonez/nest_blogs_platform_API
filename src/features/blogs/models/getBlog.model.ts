enum MyLikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export type GetBlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type GetAllBlogsType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetBlogType[];
};

type NewestLikesType = {
  addedAt: string;
  userId: string;
  login: string;
};

type ExtendedLikesType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: MyLikeStatus;
  newestLikes: [] | NewestLikesType[];
};

export type GetPostOfBlogType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesType;
};

export type GetAllPostsOfBlogType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetPostOfBlogType[];
};
