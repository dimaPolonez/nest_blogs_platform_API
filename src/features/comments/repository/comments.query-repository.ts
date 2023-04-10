import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentModel, CommentModelType } from '../core/entity/comments.entity';
import {
  GetAllCommentsType,
  GetCommentType,
  MyLikeStatus,
  NewestLikesType,
  QueryCommentType,
} from '../core/models';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(CommentModel.name)
    private readonly CommentModel: Model<CommentModelType>,
  ) {}

  sortObject(sortDir: string) {
    return sortDir === 'desc' ? -1 : 1;
  }
  skippedObject(pageNum: number, pageSize: number) {
    return (pageNum - 1) * pageSize;
  }

  async findCommentById(
    commentID: string,
    userID?: string,
  ): Promise<GetCommentType> {
    const findCommentSmart = await this.CommentModel.findById(commentID);

    if (!findCommentSmart) {
      throw new NotFoundException('comment not found');
    }

    let userStatus = MyLikeStatus.None;

    if (userID !== 'quest') {
      const findUserLike: null | NewestLikesType =
        findCommentSmart.likesInfo.newestLikes.find((l) => l.userId === userID);

      if (findUserLike) {
        userStatus = findUserLike.myStatus;
      }
    }

    return {
      id: findCommentSmart.id,
      content: findCommentSmart.content,
      commentatorInfo: {
        userId: findCommentSmart.commentatorInfo.userId,
        userLogin: findCommentSmart.commentatorInfo.userLogin,
      },
      createdAt: findCommentSmart.createdAt,
      likesInfo: {
        likesCount: findCommentSmart.likesInfo.likesCount,
        dislikesCount: findCommentSmart.likesInfo.dislikesCount,
        myStatus: userStatus,
      },
    };
  }

  async getAllCommentsOfPost(
    userID: string,
    postID: string,
    queryAll: QueryCommentType,
  ): Promise<GetAllCommentsType> {
    const allComments: CommentModelType[] = await this.CommentModel.find({
      postId: postID,
    })
      .skip(this.skippedObject(queryAll.pageNumber, queryAll.pageSize))
      .limit(queryAll.pageSize)
      .sort({ [queryAll.sortBy]: this.sortObject(queryAll.sortDirection) });

    const allMapsComments: GetCommentType[] = allComments.map((field) => {
      let userStatus = MyLikeStatus.None;

      if (userID !== 'quest') {
        const findUserLike: null | NewestLikesType =
          field.likesInfo.newestLikes.find((v) => v.userId === userID);

        if (findUserLike) {
          userStatus = findUserLike.myStatus;
        }
      }

      return {
        id: field.id,
        content: field.content,
        commentatorInfo: {
          userId: field.commentatorInfo.userId,
          userLogin: field.commentatorInfo.userLogin,
        },
        createdAt: field.createdAt,
        likesInfo: {
          likesCount: field.likesInfo.likesCount,
          dislikesCount: field.likesInfo.dislikesCount,
          myStatus: userStatus,
        },
      };
    });

    const allCount: number = await this.CommentModel.countDocuments({
      postId: postID,
    });

    const pagesCount: number = Math.ceil(allCount / queryAll.pageSize);

    return {
      pagesCount: pagesCount,
      page: queryAll.pageNumber,
      pageSize: queryAll.pageSize,
      totalCount: allCount,
      items: allMapsComments,
    };
  }
}
