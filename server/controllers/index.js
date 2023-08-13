import userModel from "../models/user.js";
import pagesModel from "../models/pages.js";
import { hashPassword, comparePassword } from "../helpers/index.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if name was entered
    if (!fullName) return res.json({ error: "Full name is required!" });

    // Check if password is valid
    if (!password || password.length < 8) return res.json({ error: "Password is required and should be at least 8 characters long" });

    // Check if email exists
    const exist = await userModel.findOne({ email });

    if (exist) return res.json({ error: "Email is already taken"});

    const hashedPassword = await hashPassword(password);

    // Create user in database
    const user = await userModel.create({ fullName, email, password: hashedPassword, role });

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

export const setConfig = async (req, res) => {
  try {
    
    const { title, description, placeholder, variableName,
      outputName, outputValue, outputUnit} = req.body;

    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);

    if (!description) return res.json({ error: "Description required!" });
    if (!fileUrls) return res.json({ error: "Image required!" });
    if (!placeholder) return res.json({ error: "Placeholder required!" });
    if (!title) return res.json({ error: "Title required!" });
    if (!variableName) return res.json({ error: "Variable name required!" });
    if (!outputName) return res.json({ error: "Output name required!" });
    if (!outputValue) return res.json({ error: "Output value required!" });
    if (!outputUnit) return res.json({ error: "Output unit required!" });

    // Create pages in database
    const pages = await pagesModel.create({ 
      image: fileUrls, title, description, placeholder, variableName, 
      outputName, outputValue, outputUnit 
    });
    
    if (!pages) return res.json({ error: "No page created" });

    return res.json(pages);
    
  } catch (error) {
    console.error(error);
  }
};

export const getLastPages = async (req, res) => {
  try {
    const lastPage = await pagesModel.findOne({}, {}, { sort: { _id: -1 } });

    if (!lastPage) return res.json({ error: "No page found" });

    return res.json(lastPage);

  } catch (error) {
    console.error(error);
  }
};