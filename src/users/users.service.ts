import { UsersRepository } from './repository/users.repository';
import { UserModel, UserModelType } from './entity/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { mongoID } from '../models';
import { CreateUserDto } from './dto';
import { NotFoundException } from '@nestjs/common';

export class UsersService {
  constructor(
    protected userRepository: UsersRepository,
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}

  async createUser(userDTO: CreateUserDto): Promise<mongoID> {
    const createUserSmart: UserModelType = await new this.UserModel(userDTO);

    await this.userRepository.save(createUserSmart);

    return createUserSmart._id;
  }

  async deleteUser(userID: string) {
    const findUser: UserModelType = await this.userRepository.findUserById(
      userID,
    );

    if (!findUser) {
      throw new NotFoundException();
    }

    await this.userRepository.deleteUser(userID);
  }

  async deleteAllUsers() {
    await this.userRepository.deleteAllUsers();
  }
}
