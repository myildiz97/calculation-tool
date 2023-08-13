import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  credentials: true,
  origin: "http://localhost:5173",
  // origin: "https://calculation-tool-client.vercel.app",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://calculation-tool-client.vercel.app');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

// Database connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser:true,
  useUnifiedTopology:true
})
  .then(() => console.log("Connected to Database!"))
  .catch((error) => console.log("Failed to connect to Database: ", error));

app.use("/", router);

const PORT = process?.env?.PORT || 8000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));