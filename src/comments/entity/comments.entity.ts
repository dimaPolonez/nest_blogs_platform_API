import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { myLikeStatus } from '../../models';
import { UpdateCommentDto } from '../dto/updateComment.dto';

export type CommentModelType = HydratedDocument<CommentModel>;

@Schema()
export class LikesInfo {
  @Prop({ required: true, default: 0 })
  likesCount: number;

  @Prop({ required: true, default: 0 })
  dislikesCount: number;

  @Prop({ required: true, enum: myLikeStatus, default: myLikeStatus.None })
  myStatus: myLikeStatus;
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

@Schema()
export class CommentatorInfo {
  @Prop({ required: true })
  userId: string;

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

  @Prop({ required: true, type: LikesInfoSchema })
  likesInfo: LikesInfo;

  updateComment(commentDTO: UpdateCommentDto) {
    this.content = commentDTO.content;
  }
}

export const CommentModelSchema = SchemaFactory.createForClass(CommentModel);

CommentModelSchema.methods = {
  updateComment: CommentModel.prototype.updateComment,
};
