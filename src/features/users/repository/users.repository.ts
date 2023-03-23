import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel, UserModelType } from '../entity/users.entity';
import { SessionUserUpdateDTOType } from '../models';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}

  async findUserById(userID: string): Promise<UserModelType | null> {
    return this.UserModel.findById({ _id: userID });
  }

  async deleteUser(userID: string) {
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
  async checkedEmail(email: string): Promise<UserModelType | null> {
    return this.UserModel.findOne({ email: email });
  }

  async checkedUniqueLogin(login: string): Promise<UserModelType | null> {
    return this.UserModel.findOne({ login: login });
  }

  async findUserByEmailOrLogin(
    loginOrEmail: string,
  ): Promise<UserModelType | null> {
    return this.UserModel.findOne({
      $or: [
        {
          login: loginOrEmail,
        },
        { email: loginOrEmail },
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
