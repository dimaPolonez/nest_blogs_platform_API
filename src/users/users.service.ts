import { UsersRepository } from './users.repository';
import { UserModel, UserModelType } from './users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UsersService {
  constructor(
    protected userRepository: UsersRepository,
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}
}
