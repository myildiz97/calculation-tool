import express from "express";
import multer from "multer";
import { registerUser, loginUser, getProfile, logout, setConfig, 
  setResults, getConfigName, getPages, getPageById , getLastPage,
  updatePage, deletePage, setCustomer, getCustomer } from "../controllers/index.js";

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

router.post("/login", loginUser);

router.post("/logout", logout);

router.post("/register", registerUser);

router.get("/admin", getConfigName);

router.post("/admin", upload.array("image", 100), setConfig);

router.put("/admin/edit/:id", upload.array("image", 100), updatePage);

router.delete("/admin/delete/:id", deletePage);

router.get("/pages", getPages);

router.get("/pages/:id", getPageById);

router.post("/calculation", setResults);

router.get("/app", getLastPage);

router.get("/app/:id", getPageById);

router.get("/apps/:id", getPageById);

router.get("/customers", getCustomer);

router.post("/customers", setCustomer);

export default router;