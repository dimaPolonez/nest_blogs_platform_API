import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BlogModel,
  BlogModelType,
  CommentModel,
  CommentModelType,
  PostModel,
  PostModelType,
  UserModel,
  UserModelType,
} from '../../../core/entity';
import { UpdateArrayPostsType } from '../../../core/models';

@Injectable()
export class SuperAdminRepository {
  constructor(
    @InjectModel(BlogModel.name)
    private readonly BlogModel: Model<BlogModelType>,
    @InjectModel(PostModel.name)
    private readonly PostModel: Model<PostModelType>,
    @InjectModel(CommentModel.name)
    private readonly CommentModel: Model<CommentModelType>,
    @InjectModel(UserModel.name)
    private readonly UserModel: Model<UserModelType>,
  ) {}

  async banedActivityUser(isBanned: boolean, userID: string) {
    await this.CommentModel.updateMany(
      {
        'commentatorInfo.userId': userID,
      },
      { 'commentatorInfo.isBanned': isBanned },
    );

    if (isBanned === true) {
      await this.UserModel.updateOne({ _id: userID }, { sessionsUser: [] });
    }
  }

  async updateAllPostsIsBanned(isBanned: boolean, userID: string) {
    await this.PostModel.updateMany(
      { 'extendedLikesInfo.newestLikes.userId': userID },
      { 'extendedLikesInfo.newestLikes.isBanned': isBanned },
    );

    return this.PostModel.find({});
  }

  async updateAllPostsCounterLikes(updateArrayPosts: UpdateArrayPostsType[]) {
    if (updateArrayPosts.length > 0) {
      for (let i = 0; i < updateArrayPosts.length; i++) {
        await this.PostModel.updateMany(
          { _id: updateArrayPosts[i].postID },
          {
            'extendedLikesInfo.likesCount': updateArrayPosts[i].likesCount,
            'extendedLikesInfo.dislikesCount':
              updateArrayPosts[i].dislikesCount,
          },
        );
      }
    }
  }

  async findBlogById(blogID: string): Promise<BlogModelType | null> {
    return this.BlogModel.findById({ _id: blogID });
  }

  async findUserById(userID: string): Promise<UserModelType | null> {
    return this.UserModel.findById({ _id: userID });
  }

  async deleteUser(userID: string) {
    await this.UserModel.deleteOne({ _id: userID });
  }

  async save(model: BlogModelType | PostModelType | UserModelType) {
    return await model.save();
  }

  async deleteAllCollections() {
    await this.BlogModel.deleteMany();
    await this.PostModel.deleteMany();
    await this.CommentModel.deleteMany();
    await this.UserModel.deleteMany();
  }
}
