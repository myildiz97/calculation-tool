import express from "express";
import multer from "multer";
import { registerUser, loginUser, getProfile, logout, setConfig, getPages } from "../controllers/index.js";

const upload = multer();

const router = express.Router();

router.get("/", getProfile);

router.post("/logout", logout);

router.post("/login", loginUser);

router.post("/register", registerUser);

router.post("/admin", upload.array("image"), setConfig);

router.get("/app", getPages);

export default router;