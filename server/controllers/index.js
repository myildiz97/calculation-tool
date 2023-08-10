import userModel from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/index.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if name was entered
    if (!fullName) return res.json({ error: "Full name is required!" });;

    // Check if password is good
    if (!password || password.length < 8) return res.json({ error: "Password is required and should be at least 8 characters long" });

    // Check email 
    const exist = await userModel.findOne({ email });

    if (exist) return res.json({ error: "Email is taken already"});

    const hashedPassword = await hashPassword(password);

    // Create user in database
    const user = await userModel.create({ fullName, email, password: hashedPassword });

    return res.json(user);

  } catch (error) {
    console.error(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ error: "No user found" });
    
    // Check if passwords match
    const match = await comparePassword(password, user.password);

    if (match) {
      jwt.sign({ email: user.email, id: user._id, fullName: user.fullName, role: user.role}, process.env.JWT_SECRET, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json(user);
      });
    } else {
      res.json({ error: "Passwords do not match" });
    }
  } catch (error) {
    console.log(error);
  }
};

const invalidatedTokens = new Set();

export const logout = (req, res) => {
  const { token } = req.cookies;

  if (token) {
    invalidatedTokens.add(token);
    res.clearCookie("token");
    res.json({ status: 200 });
  } else {
    res.status(400).json({ error: "No token found" });
  };
};

export const getProfile = (req, res) => {
  const { token } = req.cookies;

  if (token && !invalidatedTokens.has(token)) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    })
  } else {
    res.json(null);
  };
};