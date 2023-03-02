import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel, UserModelType } from './user.entity';

@Injectable()
export class UserQueryRepository {
  constructor(
    protected userRepository: UserRepository,
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}
}
