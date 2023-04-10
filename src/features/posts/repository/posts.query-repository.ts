import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostModel, PostModelType } from '../core/entity/posts.entity';
import {
  GetAllPostsType,
  GetPostType,
  MyLikeStatus,
  NewestLikesType,
  QueryPostType,
} from '../core/models';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(PostModel.name)
    private readonly PostModel: Model<PostModelType>,
  ) {}

  sortObject(sortDir: string) {
    return sortDir === 'desc' ? -1 : 1;
  }
  skippedObject(pageNum: number, pageSize: number) {
    return (pageNum - 1) * pageSize;
  }

  async findPostById(postID: string, userID?: string): Promise<GetPostType> {
    const findPostSmart = await this.PostModel.findById(postID);

    if (!findPostSmart) {
      throw new NotFoundException('post not found');
    }

    let userStatus = MyLikeStatus.None;

    if (userID !== 'quest') {
      const findUserLike: null | NewestLikesType =
        findPostSmart.extendedLikesInfo.newestLikes.find(
          (v) => v.userId === userID,
        );

      if (findUserLike) {
        userStatus = findUserLike.myStatus;
      }
    }
    let newestLikesArray = [];

    if (findPostSmart.extendedLikesInfo.newestLikes.length > 0) {
      let newestLikes: NewestLikesType[] | [] =
        findPostSmart.extendedLikesInfo.newestLikes.filter(
          (v) => v.myStatus === MyLikeStatus.Like,
        );

      newestLikes.sort(function (a: NewestLikesType, b: NewestLikesType) {
        return a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0;
      });

      newestLikes = newestLikes.slice(0, 3);

      newestLikesArray = newestLikes.map((v: NewestLikesType) => {
        return {
          userId: v.userId,
          login: v.login,
          addedAt: v.addedAt,
        };
      });
    }

    return {
      id: findPostSmart.id,
      title: findPostSmart.title,
      shortDescription: findPostSmart.shortDescription,
      content: findPostSmart.content,
      blogId: findPostSmart.blogId,
      blogName: findPostSmart.blogName,
      createdAt: findPostSmart.createdAt,
      extendedLikesInfo: {
        likesCount: findPostSmart.extendedLikesInfo.likesCount,
        dislikesCount: findPostSmart.extendedLikesInfo.dislikesCount,
        myStatus: userStatus,
        newestLikes: newestLikesArray,
      },
    };
  }

  async getAllPosts(
    userID: string,
    queryAll: QueryPostType,
    blogID?: string,
  ): Promise<GetAllPostsType> {
    let findObject: object = {};

    if (blogID) {
      findObject = { blogId: blogID };
    }

    const allPosts: PostModelType[] = await this.PostModel.find(findObject)
      .skip(this.skippedObject(queryAll.pageNumber, queryAll.pageSize))
      .limit(queryAll.pageSize)
      .sort({ [queryAll.sortBy]: this.sortObject(queryAll.sortDirection) });

    const allMapsPosts: GetPostType[] = allPosts.map((field) => {
      let userStatus = MyLikeStatus.None;

      if (userID !== 'quest') {
        const findUserLike: null | NewestLikesType =
          field.extendedLikesInfo.newestLikes.find((v) => v.userId === userID);

        if (findUserLike) {
          userStatus = findUserLike.myStatus;
        }
      }

      let newestLikesArray = [];

      if (field.extendedLikesInfo.newestLikes.length > 0) {
        let newestLikes: NewestLikesType[] | [] =
          field.extendedLikesInfo.newestLikes.filter(
            (v) => v.myStatus === MyLikeStatus.Like,
          );

        newestLikes.sort(function (a: NewestLikesType, b: NewestLikesType) {
          return a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0;
        });

        newestLikes = newestLikes.slice(0, 3);

        newestLikesArray = newestLikes.map((v: NewestLikesType) => {
          return {
            userId: v.userId,
            login: v.login,
            addedAt: v.addedAt,
          };
        });
      }

      return {
        id: field.id,
        title: field.title,
        shortDescription: field.shortDescription,
        content: field.content,
        blogId: field.blogId,
        blogName: field.blogName,
        createdAt: field.createdAt,
        extendedLikesInfo: {
          likesCount: field.extendedLikesInfo.likesCount,
          dislikesCount: field.extendedLikesInfo.dislikesCount,
          myStatus: userStatus,
          newestLikes: newestLikesArray,
        },
      };
    });

    const allCount: number = await this.PostModel.countDocuments(findObject);
    const pagesCount: number = Math.ceil(allCount / queryAll.pageSize);

    return {
      pagesCount: pagesCount,
      page: queryAll.pageNumber,
      pageSize: queryAll.pageSize,
      totalCount: allCount,
      items: allMapsPosts,
    };
  }
}
