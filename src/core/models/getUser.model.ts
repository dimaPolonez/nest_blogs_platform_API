export type GetUserType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type GetAllUsersType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: GetUserType[];
};
