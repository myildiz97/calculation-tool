import mongoose from "mongoose";
import { USER_ROLES } from "../constants/constans.js";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: USER_ROLES,
    default: USER_ROLES[1],
  },
}, {
  timestamps: true,
});

const userModel = mongoose.model("User", userSchema);

export default userModel;