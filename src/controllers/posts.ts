import { Request, Response, NextFunction } from "express";
import db from "../utils/db";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, author } = req.body;
    const post = await db.post.create({
      data: {
        title,
        content,
        author: {
          connect: { username: author },
        },
      },
    });
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allPost = await db.post.findMany();
    res.status(200).send(allPost);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};
