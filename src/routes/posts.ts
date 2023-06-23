import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/posts";
import authenticateToken from "../middleware/jwtValidate";
const express = require("express");
const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", authenticateToken, createPost);
router.put("/edit/:id", authenticateToken, updatePost);
router.delete("/delete/:id", authenticateToken, deletePost);
module.exports = router;
