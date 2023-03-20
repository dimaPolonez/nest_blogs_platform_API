import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostModel, PostModelType } from '../entity/posts.entity';
import { GetAllPostsType, GetPostType, QueryPostType } from '../models';

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

  async findPostById(postID: string): Promise<GetPostType> {
    const findPostSmart = await this.PostModel.findById(postID);

    if (!findPostSmart) {
      throw new NotFoundException('post not found');
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
        myStatus: findPostSmart.extendedLikesInfo.myStatus,
        newestLikes: findPostSmart.extendedLikesInfo.newestLikes,
      },
    };
  }

  async getAllPosts(
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
          myStatus: field.extendedLikesInfo.myStatus,
          newestLikes: field.extendedLikesInfo.newestLikes,
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
