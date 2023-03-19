import { mongoID, myLikeStatus } from '../../../models';

export class newestLikesObject {
  addedAt: string;
  userId: string;
  login: string;
}

export class extendedLikesInfoObject {
  likesCount: number;
  dislikesCount: number;
  myStatus: myLikeStatus;
  newestLikes: [] | newestLikesObject[];
}

export class GetPostDto {
  id: mongoID;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: extendedLikesInfoObject;
}

export class GetAllPostsDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetPostDto[];
}
