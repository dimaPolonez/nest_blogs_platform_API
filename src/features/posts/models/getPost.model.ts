export enum MyLikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

type NewestLikesType = {
  userId: string;
  login: string;
  myStatus: MyLikeStatus;
  addedAt: string;
};

type ExtendedLikesType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: MyLikeStatus;
  newestLikes: [] | NewestLikesType[];
};

export type GetPostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesType;
};

export type GetAllPostsType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetPostType[];
};

type LikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: MyLikeStatus;
};

type CommentatorInfoType = {
  userId: string;
  userLogin: string;
};

export type GetCommentOfPostType = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: string;
  likesInfo: LikesInfoType;
};

export type GetAllCommentsOfPostType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetCommentOfPostType[];
};
