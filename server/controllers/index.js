import userModel from "../models/user.js";
import pagesModel from "../models/pages.js";
import customerModel from "../models/customer.js";
import { hashPassword, comparePassword } from "../helpers/index.js";
import jwt from "jsonwebtoken";
import * as math from 'mathjs';

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
    return res.json({ error: "User not created!"});
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
      jwt.sign({ email: user.email, id: user._id, fullName: user.fullName, role: user.role}, 
        process.env.JWT_SECRET, {}, (err, token) => {
        if (err) throw err;
        return res.cookie("token", token).json(user);
      });
    } else {
      return res.json({ error: "Email or password wrong!" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ error: "Invalid credentials!"});
  }
};

const invalidatedTokens = new Set();

export const logout = (req, res) => {
  try {
    const { token } = req.cookies;

    // If token exist then delete it
    if (token) {
      invalidatedTokens.add(token);
      res.clearCookie("token");
      return res.json({ status: 200 });
    } else {
      return res.status(400).json({ error: "No token found" });
    };
  } catch (error) {
    console.error(error); 
    return res.json({ error: "No user to be logged out!"});
  }
};

export const getProfile = (req, res) => {
  try {
    const { token } = req.cookies;

    if (token && !invalidatedTokens.has(token)) {
      jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
        if (err) throw err;
        return res.json(user);
      })
    } else {
      return res.json(null);
    };
  } catch (error) {
    console.error(error);
    return res.json({ error: "No user found!"});
  }
};

export const getConfigName = async (req, res) => {
  try {
    const { configName } = req.query;
    if (!configName) return res.json({ error: "Config name is required!"});

    // Check if config name is already given in both cases of lowercase and uppercase
    const exist = await pagesModel.findOne({ configName: { $regex: new RegExp(`^${configName}$`, "i") }, });
    if (exist) return res.json({ error: "The config name is already given to another page setting!"});
    
    return res.json({ configName });
  } catch (error) {
    console.error(error);
    return res.json({ error: "Config name could not obtained!"});
  }
};

export const setConfig = async (req, res) => {
  try {
    
    const { configName, title, description, placeholder, variableName,
      outputName, outputValue, outputUnit, calculation } = req.body;
      
    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);

    if (!description) return res.json({ error: "Description required!" });
    if (!fileUrls) return res.json({ error: "Image required!" });
    if (!placeholder) return res.json({ error: "Placeholder required!" });
    if (!title) return res.json({ error: "Title required!" });
    if (!variableName) return res.json({ error: "Variable name required!" });
    if (!outputName) return res.json({ error: "Output name required!" });
    if (!outputValue) return res.json({ error: "Output value required!" });
    if (!outputUnit) return res.json({ error: "Output unit required!" });
    if (!calculation) return res.json({ error: "Calculation setting required!" });
    if (!configName) return res.json({ error: "Config name required!" });
  
    // Create pages in database
    const pages = await pagesModel.create({ 
      configName, image: fileUrls, title, description, placeholder, variableName, 
      outputName, outputValue, outputUnit, calculation 
    });
    
    if (!pages) return res.json({ error: "No page created" });

    return res.json(pages);
    
  } catch (error) {
    console.error(error);
    return res.json({ error: "Pages could not created!"});
  }
};

export const getLastPage = async (req, res) => {
  try {
    const lastPage = await pagesModel.findOne({}, {}, { sort: { _id: -1 } });

    if (!lastPage) return res.json({ error: "No page found" });

    return res.json(lastPage);

  } catch (error) {
    console.error(error);
    return res.json({ error: "Page not found!"});
  }
};

export const getPages = async (req, res) => {
  try {
    const pages = await pagesModel.find({});
    if (!pages) return res.json({ error: "Pages not found" });
    return res.json(pages);
  } catch (error) {
    console.error(error);
    return res.json({ error: "No pages to be found!"});
  }
};

export const setResults = async (req, res) => {
  const results = {};

  try {
    const { expressions, outputs } = req.body;
    const parsedExp = JSON.parse(expressions);
    const parsedOutputs = JSON.parse(outputs);

    parsedOutputs.forEach(key => results[key] = null);

    const pattern = /FILL!([A-Za-z]+)!/;

    for (const [index, expr] of parsedExp.entries()) {
      let newExp = null;
      if (expr.match(pattern)) {
        const startIndex = expr.indexOf('!') + 1;
        const endIndex = expr.lastIndexOf('!');
        const char = expr.substring(startIndex, endIndex);
        const value = results[char];
        newExp = expr.replace(new RegExp(`FILL!${char}!`, 'g'), value);
      };

      const result = newExp ? await math.evaluate(newExp) : await math.evaluate(expr);
      const key = parsedOutputs[index];
      results[key] = result;
    };
    
    return res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Invalid expression or calculation error." });
  }
};

export const getPageById = async (req, res) => {
  try {
    const id = req.params.id;

    const page = await pagesModel.find({ _id: id });

    if (!page) return res.json({ error: `Page with the id of ${id} not found!`});

    return res.json({ page });
  } catch (error) {
    console.error(error);
    return res.json({ error: "Page with the given id is not obtained!" });
  }
};

export const updatePage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.json({ error: "Page ID is required!" });

    const { title, description, placeholder, variableName, outputName, outputValue, outputUnit, calculation } = req.body;

    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);

    const updatedPage = await pagesModel.findByIdAndUpdate(
      id,
      {
        image: fileUrls,
        title,
        description,
        placeholder,
        variableName,
        outputName,
        outputValue,
        outputUnit,
        calculation,
      },
      { new: true }
    );

    if (!updatedPage)  return res.json({ error: "Page not found!" });

    return res.json({ updatedPage });

  } catch (error) {
    console.error(error);
    return res.json({ error: "Error updating page!" });
  }
};

export const deletePage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.json({ error: "Page ID is required!" });

    const deletedPage = await pagesModel.findByIdAndDelete(id);

    if (!deletedPage) return res.json({ error: "Page not found!" });

    return res.json({ message: "Page deleted successfully!" });

  } catch (error) {
    console.error(error);
    return res.json({ error: "Error deleting page!" });
  }
};

export const getCustomer = async (req, res) => {
  try {
    const customers = await customerModel.find({});

    if (!customers) return res.json({ error: "Customers not found!" });

    return res.json(customers);
  } catch (error) {
    console.error(error);
    return res.json({ error: "Error getting customers!"});
  }
};

export const setCustomer = async (req, res) => {
  try {
    const { name, surname, phone } = req.body;

    // Check if name was entered
    if (!name) return res.json({ error: "Name is required!" });

    // Check if surname was entered
    if (!surname) return res.json({ error: "Surname is required!" });

    // Check if phone was entered
    if (!phone) return res.json({ error: "Phone number is required!" });

    // Create customer in database
    const customer = await customerModel.create({ name, surname, phone });

    return res.json(customer);

  } catch (error) {
    console.error(error);
    return res.json({ error: "Customer not created!"});
  }
};