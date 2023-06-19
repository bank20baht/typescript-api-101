import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateTokens } from "./generateTokens";
import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";
const prisma = new PrismaClient();

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const tokens = generateTokens(user);
      return res.status(200).json({
        name: user.username,
        password: user.password,
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

const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUser) {
      return res.status(409).send("User already exists. Please login");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    const tokens = generateTokens(newUser);

    await prisma.user.update({
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

export { login, register };
