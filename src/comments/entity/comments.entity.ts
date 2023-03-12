import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { myLikeStatus } from '../../models';
import { UpdateCommentDto } from '../dto';

export type CommentModelType = HydratedDocument<CommentModel>;

@Schema()
export class LikesInfo {
  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  dislikesCount: number;

  @Prop({ enum: myLikeStatus, default: myLikeStatus.None })
  myStatus: myLikeStatus;
}

@Schema()
export class CommentatorInfo {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userLogin: string;
}

@Schema()
export class CommentModel {
  @Prop({ required: true })
  content: string;

  @Prop({ default: () => ({}) })
  commentatorInfo: CommentatorInfo;

  @Prop({ required: true })
  postId: string;

  @Prop({
    default: () => {
      return new Date().toISOString();
    },
  })
  createdAt: string;

  @Prop({ default: () => ({}) })
  likesInfo: LikesInfo;

  updateComment(commentDTO: UpdateCommentDto) {
    this.content = commentDTO.content;
  }
}

export const CommentModelSchema = SchemaFactory.createForClass(CommentModel);

CommentModelSchema.methods = {
  updateComment: CommentModel.prototype.updateComment,
};
