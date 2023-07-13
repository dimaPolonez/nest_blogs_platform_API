export type GetUserType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

type BanInfo = {
  isBanned: boolean;
  banDate: string;
  banReason: string;
};

export type GetUserAdminType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  banInfo: BanInfo;
};

export type GetAllUsersType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetUserType[];
};

export type GetAllUsersAdminType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetUserAdminType[];
};
