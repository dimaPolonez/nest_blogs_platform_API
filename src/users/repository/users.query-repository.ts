import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel, UserModelType } from '../entity/users.entity';
import { mongoID } from '../../models';
import { GetAllUsersDto, GetUserDto, QueryUserDto } from '../dto';

@Injectable()
export class UsersQueryRepository {
  constructor(
    protected userRepository: UsersRepository,
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}
  sortObject(sortDir: string) {
    return sortDir === 'desc' ? -1 : 1;
  }
  skippedObject(pageNum: number, pageSize: number) {
    return (pageNum - 1) * pageSize;
  }

  async findUserById(userID: mongoID | string): Promise<GetUserDto> {
    const findUserSmart = await this.UserModel.findById(userID);

    if (!findUserSmart) {
      throw new NotFoundException();
    }

    return {
      id: findUserSmart._id,
      login: findUserSmart.infUser.login,
      email: findUserSmart.infUser.email,
      createdAt: findUserSmart.infUser.createdAt,
    };
  }

  async getAllUsers(queryAll: QueryUserDto): Promise<GetAllUsersDto> {
    const allUsers: UserModelType[] = await this.UserModel.find({
      $or: [
        { 'infUser.login': new RegExp(queryAll.searchLoginTerm, 'gi') },
        { 'infUser.email': new RegExp(queryAll.searchEmailTerm, 'gi') },
      ],
    })
      .skip(this.skippedObject(queryAll.pageNumber, queryAll.pageSize))
      .limit(queryAll.pageSize)
      .sort({ [queryAll.sortBy]: this.sortObject(queryAll.sortDirection) });

    const allMapsUsers: GetUserDto[] = allUsers.map((field) => {
      return {
        id: field._id,
        login: field.infUser.login,
        email: field.infUser.email,
        createdAt: field.infUser.createdAt,
      };
    });

    const allCount: number = await this.UserModel.countDocuments({
      $or: [
        { 'infUser.login': new RegExp(queryAll.searchLoginTerm, 'gi') },
        { 'infUser.email': new RegExp(queryAll.searchEmailTerm, 'gi') },
      ],
    });
    const pagesCount: number = Math.ceil(allCount / queryAll.pageSize);

    return {
      pagesCount: pagesCount,
      page: queryAll.pageNumber,
      pageSize: queryAll.pageSize,
      totalCount: allCount,
      items: allMapsUsers,
    };
  }
}
