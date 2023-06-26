import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { generateTokens } from "../utils/generateTokens";
import db from "../utils/db";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const tokens = generateTokens(user);
      await db.user.update({
        where: {
          username: username,
        },
        data: {
          refreshtoken: tokens.refreshToken,
        },
      });
      return res.status(200).json({
        name: user.username,
        accesstoken: tokens.accessToken,
        refreshtoken: tokens.refreshToken,
      });
    }
    return res.status(400).send("Invalid credentials");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const existingUser = await db.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUser) {
      return res.status(409).send("User already exists. Please login");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    const tokens = generateTokens(newUser);

    await db.user.update({
      where: {
        id: newUser.id,
      },
      data: {
        refreshtoken: tokens.refreshToken,
      },
    });

    const user = {
      username: newUser.username,
      accesstoken: tokens.accessToken,
      refreshtoken: tokens.refreshToken,
    };

    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

interface AuthenticatedRequest extends Request {
  body: {
    refreshtoken: string;
  };
  user: {
    username: string;
    iat: number;
    exp: number;
  };
}

export const refreshToken = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    console.log("refresh token work");
    const username = req.user.username;
    let newToken;
    const oldUser = await db.user.findUnique({
      where: {
        username: req.user.username,
      },
    });
    const oldRefreshToken = oldUser?.refreshtoken;
    const refreshTokenFromBody = req.body.refreshtoken;

    // Check if refresh token in the request body matches the one in the database
    console.log("Old Refresh Token = " + oldRefreshToken);
    console.log("refresh token from request = " + refreshTokenFromBody);
    if (oldRefreshToken?.toString() !== refreshTokenFromBody.toString()) {
      console.log("not same refreshtoken");
      return res.sendStatus(401);
    }
    // Verify the validity of the refresh token
    const isValidRefreshToken = jwt.verify(
      String(oldRefreshToken),
      process.env.REFRESH_TOKEN_SECRET as Secret
    ) as jwt.JwtPayload;

    if (!isValidRefreshToken) {
      return res.sendStatus(401);
    }

    if (oldUser) {
      const token = generateTokens(oldUser);
      newToken = token;
    }

    console.log("New Refresh Token = " + newToken?.refreshToken);

    await db.user.update({
      where: {
        id: oldUser?.id,
      },
      data: {
        refreshtoken: newToken?.refreshToken,
      },
    });

    const user = {
      username: oldUser?.username,
      accesstoken: newToken?.accessToken,
      refreshtoken: newToken?.refreshToken,
    };

    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};
