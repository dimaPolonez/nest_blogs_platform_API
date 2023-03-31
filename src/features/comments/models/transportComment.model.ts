import { MyLikeStatus } from './getComment.model';

export type CreateCommentOfPostType = {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  postId: string;
};

export type UpdateCommentType = {
  content: string;
};

export type QueryCommentType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};

export type UpdateLikeStatusCommentType = {
  likeStatus: MyLikeStatus;
};
