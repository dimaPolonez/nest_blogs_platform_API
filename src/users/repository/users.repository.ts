import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel, UserModelType } from '../entity/users.entity';
import { mongoID } from '../../models';
import { isAfter } from 'date-fns';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}

  async findUserById(userID: mongoID | string): Promise<UserModelType | null> {
    return this.UserModel.findById(userID);
  }

  async deleteUser(userID: string | mongoID) {
    await this.UserModel.deleteOne({ _id: userID });
  }

  async deleteAllUsers() {
    await this.UserModel.deleteMany();
  }

  async findUserByCode(code: string): Promise<UserModelType | null> {
    return this.UserModel.findOne({
      'activateUser.codeActivated': code,
    });
  }
  async checkedEmailAndLoginUnique(
    email: string,
    login: string,
  ): Promise<UserModelType | null> {
    return this.UserModel.findOne({
      $or: [
        {
          login: login,
        },
        { email: email },
      ],
    });
  }

  async findUserEmailToBase(email: string): Promise<UserModelType | null> {
    return this.UserModel.findOne({ email: email });
  }

  async save(model: UserModelType) {
    return await model.save();
  }
}
