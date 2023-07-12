export type CodeConfirmType = {
  code: string;
};

export type CreateUserMailType = {
  login: string;
  password: string;
  email: string;
};
export type EmailRecPassType = {
  email: string;
};

export type EmailResendType = {
  email: string;
};

type LoginType = {
  loginOrEmail: string;
  password: string;
};

type NewPassType = {
  newPassword: string;
  recoveryCode: string;
};

export type AuthObjectType = {
  ip: string;
  nameDevice: string;
  userID: string;
};

export type AuthObjectUpdateType = {
  ip: string;
  nameDevice: string;
  userID: string;
  deviceID: string;
};

export type TokensObjectType = {
  refreshToken: string;
  accessDTO: {
    accessToken: string;
  };
  optionsCookie: {
    httpOnly: boolean;
    secure: boolean;
  };
};

type AboutMeType = {
  email: string;
  login: string;
  userId: string;
};
