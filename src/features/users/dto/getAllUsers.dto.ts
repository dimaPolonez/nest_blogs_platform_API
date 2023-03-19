import { mongoID } from '../../../models';

export class GetUserDto {
  id: mongoID;
  login: string;
  email: string;
  createdAt: string;
}

export class GetAllUsersDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetUserDto[];
}
