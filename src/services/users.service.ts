import { UsersRepository } from '../repositories/users.repository';
import { UserModel, UserModelType } from '../core/entities/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UsersService {
  constructor(
    protected userRepository: UsersRepository,
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}
}
