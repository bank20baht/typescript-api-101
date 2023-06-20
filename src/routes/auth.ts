const { login, register, refreshToken } = require("../controllers/auth");
const express = require("express");
const router = express.Router();
import jwtRefreshTokenValidate from "../middleware/jwtRefreshTokenValidate";

router.post("/login", login);
router.post("/register", register);
router.post("/refresh", jwtRefreshTokenValidate, refreshToken);
module.exports = router;
