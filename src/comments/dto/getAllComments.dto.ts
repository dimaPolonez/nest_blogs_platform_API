import { mongoID, myLikeStatus } from '../../models';

export class likesInfoObject {
  likesCount: number;
  dislikesCount: number;
  myStatus: myLikeStatus;
}

export class commentatorInfoObject {
  userId: string;
  userLogin: string;
}

export class GetCommentDto {
  id: mongoID;
  content: string;
  commentatorInfo: commentatorInfoObject;
  createdAt: string;
  likesInfo: likesInfoObject;
}

export class GetAllCommentsDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetCommentDto[];
}
