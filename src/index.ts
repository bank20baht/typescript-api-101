import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import jwtValidate from "./middleware/jwtValidate";
import path from "path";
import multer from "multer";
const auth = require("./routes/auth");
const posts = require("./routes/posts");

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/public", express.static(path.resolve(__dirname, "../public")));

app.use("/api/auth", auth);
app.use("/api/posts", posts);

// Start the server
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
