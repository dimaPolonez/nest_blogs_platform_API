import mongoose from 'mongoose';

export type mongoID = mongoose.Types.ObjectId;

export enum myLikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export type testObject = {
  basic: string;
  accessToken: string;
  refreshToken: string;
  userID: string;
  blogID: string;
  postID: string;
};
