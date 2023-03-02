import { UserRepository } from './user.repository';
import { UserModel, UserModelType } from './user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UserService {
  constructor(
    protected userRepository: UserRepository,
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}
}
