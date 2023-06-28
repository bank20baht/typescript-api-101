import { Request, Response } from "express";

const upload_img = async (req: any, res: Response) => {
  const { filename } = req.file;
  console.log(filename);
  res.status(200).send("upload finish");
};

export { upload_img };
