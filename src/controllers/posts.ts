import { Request, Response, NextFunction } from "express";
import db from "../utils/db";

interface AuthenticatedRequest extends Request {
  user: {
    username: string;
    iat: number;
    exp: number;
  };
}

export const createPost = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.user);
    const { filename } = req.file;
    console.log("createPost endpoint = " + filename);
    const { content, author } = req.body;
    const post = await db.post.create({
      data: {
        image: `http://localhost:8000/public/${filename}`,
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
    const allPosts = await db.post.findMany({
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });
    res.status(200).send(allPosts);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await db.post.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    if (post) {
      res.status(200).send(post);
    } else {
      res.status(404).send({ message: "Post not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

export const updatePost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content } = req.body;
    const verifyUpdate = await db.post.findUnique({
      where: {
        id: Number(req.params.id),
      },
      select: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });
    if (verifyUpdate?.author?.username === req.user.username) {
      const updatePost = await db.post.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          content: content,
        },
      });
      if (updatePost) {
        res.status(200).send({ message: "Post updated successfully" });
      } else {
        res.status(404).send({ message: "Post not found" });
      }
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

export const deletePost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const verifyDelete = await db.post.findUnique({
      where: {
        id: Number(req.params.id),
      },
      select: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });
    if (verifyDelete?.author?.username === req.user.username) {
      const deletePost = await db.post.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      if (deletePost) {
        res.status(200).send({ message: "Post has been deleted" });
      } else {
        res.status(404).send({ message: "Post not found" });
      }
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};
