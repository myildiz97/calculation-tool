import express from "express";
import { registerUser, loginUser, getProfile, logout } from "../controllers/index.js";

const router = express.Router();

router.get("/", getProfile);

router.post("/logout", logout);

router.post("/login", loginUser);

router.post("/register", registerUser);

export default router;