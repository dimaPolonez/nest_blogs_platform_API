import mongoose from 'mongoose';

export type mongoID = mongoose.Types.ObjectId;

export enum myLikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}
