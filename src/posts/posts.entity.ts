import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { myLikeStatus, newestLikesType } from './model/posts.model';

export type PostModelType = HydratedDocument<PostModel>;

@Schema()
export class ExtendedLikesInfo {
  @Prop({ required: true, default: 0 })
  likesCount: number;

  @Prop({ required: true, default: 0 })
  dislikesCount: number;

  @Prop({ required: true, enum: myLikeStatus, default: myLikeStatus.None })
  myStatus: myLikeStatus;

  @Prop({ required: true, default: [] })
  newestLikes: [newestLikesType];
}

export const ExtendedLikesInfoSchema =
  SchemaFactory.createForClass(ExtendedLikesInfo);

@Schema()
export class PostModel {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true, default: new Date().toISOString() })
  createdAt: string;

  @Prop({ required: true, type: ExtendedLikesInfoSchema })
  extendedLikesInfo: ExtendedLikesInfo;
}

export const PostModelSchema = SchemaFactory.createForClass(PostModel);
