import { createPost, getAllPosts, getPostById } from "../controllers/posts";
import authenticateToken from "../middleware/jwtValidate";
const express = require("express");
const router = express.Router();

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
module.exports = router;
