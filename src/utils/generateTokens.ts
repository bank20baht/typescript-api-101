import jwt from "jsonwebtoken";

export function generateTokens(user: any) {
  const { id, username } = user;
  const accessToken = jwt.sign(
    { user_id: id, username },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "3m", algorithm: "HS256" }
  );
  const refreshToken = jwt.sign(
    { user_id: id, username },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "1d", algorithm: "HS256" }
  );
  return { accessToken, refreshToken };
}
