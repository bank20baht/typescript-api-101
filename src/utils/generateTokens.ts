import jwt from "jsonwebtoken";

type tokenInfomation = {
  username: string;
};

export function generateTokens(user: tokenInfomation) {
  const { username } = user;
  const accessToken = jwt.sign(
    { username: username },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "3m", algorithm: "HS256" }
  );
  const refreshToken = jwt.sign(
    { username: username },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "1d", algorithm: "HS256" }
  );
  return { accessToken, refreshToken };
}
