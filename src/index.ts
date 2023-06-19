import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import jwtValidate from "./middleware/jwtValidate";

const auth = require("./routes/auth");
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", auth);

app.get("/user", async (req: Request, res: Response, next: NextFunction) => {
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
  res.json({ user: allUsers });
});

app.get("/", jwtValidate, (req, res) => {
  res.send("Hello World!");
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
