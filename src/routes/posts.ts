import { createPost, getAllPosts } from "../controllers/posts";
import authenticateToken from "../middleware/jwtValidate";
const express = require("express");
const router = express.Router();

router.post("/", createPost);
router.get("/", getAllPosts);

module.exports = router;
