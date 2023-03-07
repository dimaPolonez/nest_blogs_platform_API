import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ExtendedLikesInfo, ExtendedLikesInfoSchema } from '.';

export type CommentModelType = HydratedDocument<CommentModel>;

@Schema()
export class CommentatorInfo {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: ObjectId;

  @Prop({ required: true })
  userLogin: string;
}

export const CommentatorInfoSchema =
  SchemaFactory.createForClass(CommentatorInfo);

@Schema()
export class CommentModel {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: CommentatorInfoSchema })
  commentatorInfo: CommentatorInfo;

  @Prop({ required: true })
  postId: string;

  @Prop({ required: true, default: new Date().toISOString() })
  createdAt: string;

  @Prop({ required: true, type: ExtendedLikesInfoSchema })
  likesInfo: ExtendedLikesInfo;
}

export const CommentModelSchema = SchemaFactory.createForClass(CommentModel);
