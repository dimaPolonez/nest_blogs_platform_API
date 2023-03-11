import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel, UserModelType } from '../entity/users.entity';
import { mongoID } from '../../models';

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

  async save(model: UserModelType) {
    return await model.save();
  }
}
