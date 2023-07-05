import express, { Router, Request, Response } from "express";
import { upload_img } from "../controllers/upload";
import { uploadMiddleware } from "../middleware/upload";

const router: Router = express.Router();

router.post("/upload", uploadMiddleware, upload_img);

export default router;
