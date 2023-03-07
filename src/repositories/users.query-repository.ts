import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel, UserModelType } from '../core/entities/users.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(
    protected userRepository: UsersRepository,
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}
}
