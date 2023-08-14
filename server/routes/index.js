import express from "express";
import multer from "multer";
import { registerUser, loginUser, getProfile, logout, setConfig, getLastPages, setResults} from "../controllers/index.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.get("/", getProfile);

router.post("/logout", logout);

router.post("/login", loginUser);

router.post("/register", registerUser);

router.post("/admin", upload.array("image", 100), setConfig);

router.get("/app", getLastPages);

router.post("/calculation", setResults);

export default router;