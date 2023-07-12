enum MyLikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

type LikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: MyLikeStatus;
};

type CommentatorInfoType = {
  userId: string;
  userLogin: string;
};

type NewestLikesType = {
  userId: string;
  login: string;
  myStatus: MyLikeStatus;
  addedAt: string;
};

export type GetCommentType = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: string;
  likesInfo: LikesInfoType;
};

export type GetAllCommentsType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetCommentType[];
};

export type UserObject = {
  userID: string;
  login: string;
};