import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isAfter } from 'date-fns';
import { ConfirmUserType } from '../models';

export type UserModelType = HydratedDocument<UserModel>;

@Schema()
export class ActivateUser {
  @Prop({ default: 'Activated' })
  codeActivated: string;

  @Prop({ default: 'Activated' })
  lifeTimeCode: string;

  @Prop({ default: true })
  confirm: boolean;
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
  sessionsUser: SessionsUser[];

  async checkedActivateCodeValid(): Promise<boolean> {
    const dateExpiredCode = Date.parse(this.activateUser.lifeTimeCode);
    const dateNow = new Date();

    if (isAfter(dateExpiredCode, dateNow)) {
      return true;
    }
    return false;
  }

  async updateActivateUser(userActivateDTO: ConfirmUserType) {
    this.activateUser.codeActivated = userActivateDTO.codeActivated;
    this.activateUser.lifeTimeCode = userActivateDTO.lifeTimeCode;
    this.activateUser.confirm = userActivateDTO.confirm;
  }

  async updateActivateUserAndPassword(
    userActivateDTO: ConfirmUserType,
    newPass: string,
  ) {
    this.hushPass = newPass;

    this.activateUser.codeActivated = userActivateDTO.codeActivated;
    this.activateUser.lifeTimeCode = userActivateDTO.lifeTimeCode;
    this.activateUser.confirm = userActivateDTO.confirm;
  }
}

export const UserModelSchema = SchemaFactory.createForClass(UserModel);

UserModelSchema.methods = {
  checkedActivateCodeValid: UserModel.prototype.checkedActivateCodeValid,
  updateActivateUser: UserModel.prototype.updateActivateUser,
  updateActivateUserAndPassword:
    UserModel.prototype.updateActivateUserAndPassword,
};
