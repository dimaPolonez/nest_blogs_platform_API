import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserModelType = HydratedDocument<UserModel>;

@Schema()
export class InfUser {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  hushPass: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, default: new Date().toISOString() })
  createdAt: string;
}

export const InfUserSchema = SchemaFactory.createForClass(InfUser);

@Schema()
export class ActivateUser {
  @Prop({ required: true, default: 'Activated' })
  codeActivated: string;

  @Prop({ required: true, default: 'Activated' })
  lifeTimeCode: string;

  @Prop({ required: true, default: true })
  confirm: string;
}

export const ActivateUserSchema = SchemaFactory.createForClass(ActivateUser);

@Schema()
export class SessionsUser {
  @Prop({ required: true })
  sessionID: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  expiresTime: string;

  @Prop({ required: true, default: new Date().toISOString() })
  lastActivateTime: string;
}

export const SessionsUserSchema = SchemaFactory.createForClass(SessionsUser);

@Schema()
export class UserModel {
  @Prop({ required: true, type: InfUserSchema })
  infUser: InfUser;

  @Prop({ required: true, type: ActivateUserSchema })
  activateUser: ActivateUser;

  @Prop({ required: true, type: SessionsUserSchema })
  sessionsUser: SessionsUser;
}

export const UserModelSchema = SchemaFactory.createForClass(UserModel);
