import { Request, Response, NextFunction } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

export function uploadMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  upload.single("photo")(req, res, (error: any) => {
    if (error) {
      // Handle any error that occurred during file upload
      return res.status(400).json({ error: "File upload failed" });
    }
    // File upload succeeded, proceed to the next middleware or route handler
    next();
  });
}
