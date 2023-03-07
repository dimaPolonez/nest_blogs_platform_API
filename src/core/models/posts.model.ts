import { ObjectId, Schema } from 'mongoose';

export type createPostBodyType = {
  body: string;
};

export type createCommentOfPostBodyType = {
  body: string;
};

export type updatePostBodyType = {
  body: string;
};

export type likePostBodyType = {
  body: string;
};

export enum myLikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export type likesInfoPost = {
  likesCount: number;
  dislikesCount: number;
  myStatus: myLikeStatus;
  newestLikes: newestLikesType[];
};

export type newestLikesType = {
  userId: ObjectId;
  login: string;
  status: myLikeStatus;
  addedAt: string;
};
