export type SessionUserType = {
  sessionID: string;
  ip: string;
  title: string;
  expiresTime: string;
  lastActivateTime: string;
};

export type SessionUserDTOType = {
  userID: string;
  ip: string;
  nameDevice: string;
  expiresTime: string;
};

export type SessionUserUpdateDTOType = {
  userID: string;
  deviceID: string;
  ip: string;
  nameDevice: string;
  expiresTime: string;
};

export type CreateUserType = {
  login: string;
  password: string;
  email: string;
};

export type QueryUserType = {
  searchLoginTerm: string;
  searchEmailTerm: string;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};

export type ConfirmUserType = {
  codeActivated: string;
  lifeTimeCode: string;
  confirm: boolean;
};

export type NewPassType = {
  newPassword: string;
  recoveryCode: string;
};

export type LoginType = {
  loginOrEmail: string;
  password: string;
};

export type AboutMeType = {
  email: string;
  login: string;
  userId: string;
};
