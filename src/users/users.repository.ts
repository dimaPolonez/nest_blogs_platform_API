import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel, UserModelType } from './users.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}
}
