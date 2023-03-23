export const RefreshCookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['refreshToken'];
    console.log(token);
  }
  return token;
};
