import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  banStatus,
  GetAllBlogsType,
  GetAllUsersAdminType,
  GetBlogAdminType,
  GetUserAdminType,
  QueryBlogType,
  QueryUsersAdminType,
} from '../../../core/models';
import {
  BlogModel,
  BlogModelType,
  UserModel,
  UserModelType,
} from '../../../core/entity';

@Injectable()
export class SuperAdminQueryRepository {
  constructor(
    @InjectModel(BlogModel.name)
    private readonly BlogModel: Model<BlogModelType>,
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}

  sortObject(sortDir: string) {
    return sortDir === 'desc' ? -1 : 1;
  }
  skippedObject(pageNum: number, pageSize: number) {
    return (pageNum - 1) * pageSize;
  }

  banFilter(options: string): boolean {
    if (options === banStatus.banned) {
      return true;
    } else {
      return false;
    }
  }

  async getAllBlogsToAdmin(queryAll: QueryBlogType): Promise<GetAllBlogsType> {
    const allBlogs: BlogModelType[] = await this.BlogModel.find({
      name: new RegExp(queryAll.searchNameTerm, 'gi'),
    })
      .skip(this.skippedObject(queryAll.pageNumber, queryAll.pageSize))
      .limit(queryAll.pageSize)
      .sort({
        [queryAll.sortBy]: this.sortObject(queryAll.sortDirection),
      });

    const allMapsBlogs: GetBlogAdminType[] = allBlogs.map((field) => {
      return {
        id: field.id,
        name: field.name,
        description: field.description,
        websiteUrl: field.websiteUrl,
        createdAt: field.createdAt,
        isMembership: field.isMembership,
        blogOwnerInfo: {
          userId: field.blogOwnerInfo.userId,
          userLogin: field.blogOwnerInfo.userLogin,
        },
      };
    });

    const allCount: number = await this.BlogModel.countDocuments({
      name: new RegExp(queryAll.searchNameTerm, 'gi'),
    });
    const pagesCount: number = Math.ceil(allCount / queryAll.pageSize);

    return {
      pagesCount: pagesCount,
      page: queryAll.pageNumber,
      pageSize: queryAll.pageSize,
      totalCount: allCount,
      items: allMapsBlogs,
    };
  }

  async findUserById(userID: string): Promise<GetUserAdminType> {
    const findUserSmart = await this.UserModel.findById(userID);

    if (!findUserSmart) {
      throw new NotFoundException('user not found');
    }

    return {
      id: findUserSmart.id,
      login: findUserSmart.login,
      email: findUserSmart.email,
      createdAt: findUserSmart.createdAt,
      banInfo: {
        isBanned: findUserSmart.banInfo.isBanned,
        banDate: findUserSmart.banInfo.banDate,
        banReason: findUserSmart.banInfo.banReason,
      },
    };
  }
  async getAllUsersAdmin(
    queryAll: QueryUsersAdminType,
  ): Promise<GetAllUsersAdminType> {
    const allUsers: UserModelType[] = await this.UserModel.find({
      $or: [
        { login: new RegExp(queryAll.searchLoginTerm, 'gi') },
        { email: new RegExp(queryAll.searchEmailTerm, 'gi') },
      ],
    })
      .skip(this.skippedObject(queryAll.pageNumber, queryAll.pageSize))
      .limit(queryAll.pageSize)
      .sort({ [queryAll.sortBy]: this.sortObject(queryAll.sortDirection) });

    let allCountNumber = 0;

    const allMapsUsers: GetUserAdminType[] = allUsers.map((field) => {
      if (queryAll.banStatus === banStatus.all) {
        allCountNumber++;
        return {
          id: field.id,
          login: field.login,
          email: field.email,
          createdAt: field.createdAt,
          banInfo: {
            isBanned: field.banInfo.isBanned,
            banDate: field.banInfo.banDate,
            banReason: field.banInfo.banReason,
          },
        };
      }

      if (field.banInfo.isBanned === this.banFilter(queryAll.banStatus)) {
        allCountNumber++;
        return {
          id: field.id,
          login: field.login,
          email: field.email,
          createdAt: field.createdAt,
          banInfo: {
            isBanned: field.banInfo.isBanned,
            banDate: field.banInfo.banDate,
            banReason: field.banInfo.banReason,
          },
        };
      }
    });

    const pagesCount: number = Math.ceil(allCountNumber / queryAll.pageSize);

    return {
      pagesCount: pagesCount,
      page: queryAll.pageNumber,
      pageSize: queryAll.pageSize,
      totalCount: allCountNumber,
      items: allMapsUsers,
    };
  }
}
