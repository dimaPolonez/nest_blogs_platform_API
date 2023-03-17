export type authObjectDTO = {
  ip: string;
  nameDevice: string;
  userID: string;
};

export type tokensDTO = {
  refreshToken: string;
  accessDTO: {
    accessToken: string;
  };
  optionsCookie: {
    httpOnly: boolean;
    secure: boolean;
  };
};
