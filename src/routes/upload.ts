import express, { Router, Request, Response } from "express";
import { upload_img } from "../controllers/upload";
import multer from "multer";

const router: Router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("photo"), upload_img);

export = router;
