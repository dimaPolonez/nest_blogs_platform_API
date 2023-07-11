import { MyLikeStatus } from './getPost.model';

type CreateCommentOfPostType = {
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

type QueryCommentType = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};

export type UpdateLikeStatusCommentType = {
  likeStatus: MyLikeStatus;
};
