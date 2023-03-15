import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserModelType = HydratedDocument<UserModel>;

@Schema()
export class ActivateUser {
  @Prop({ default: 'Activated' })
  codeActivated: string;

  @Prop({ default: 'Activated' })
  lifeTimeCode: string;

  @Prop({ default: true })
  confirm: string;
}

@Schema()
export class SessionsUser {
  @Prop({ default: null })
  sessionID: string;

  @Prop({ default: null })
  ip: string;

  @Prop({ default: null })
  title: string;

  @Prop({ default: null })
  expiresTime: string;

  @Prop({
    default: () => {
      return new Date().toISOString();
    },
  })
  lastActivateTime: string;
}

@Schema()
export class UserModel {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  hushPass: string;

  @Prop({ required: true })
  email: string;

  @Prop({
    default: () => {
      return new Date().toISOString();
    },
  })
  createdAt: string;

  @Prop({ default: () => ({}) })
  activateUser: ActivateUser;

  @Prop({ default: () => ({}) })
  sessionsUser: SessionsUser;
}

export const UserModelSchema = SchemaFactory.createForClass(UserModel);
