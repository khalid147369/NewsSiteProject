import { Request, Response } from "express";
import UserModel, { IUser } from "../models/user"; // Import the Mongoose User model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import user from "../models/user";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    console.log("Registering user:", { username, email, password });
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
    next(err)
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid pasword or username" });
    }

    // Generate JWT access token
    console.log('roles from login: ',user.roles);
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.roles,
        email: user.email

      },
      // complita anadir authinticacion de deletePosts y rutas que lo necesitan  <>||===============================|
     
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "15m" }
    );

    // Generate JWT refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
      { expiresIn: "7d" }
    );

    // Store refresh token in DB for this user
    await UserModel.updateOne(
      { _id: user._id },
      { $set: { refreshtoken: refreshToken } }
    );

    // Send refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      user: { username: user.username, email: user.email, role: user.roles },
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find({}, { password: 0 ,refreshtoken:0}); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Add logout endpoint
export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(204).json({ message: "No refresh token provided" });
    }

    // Find user by refresh token
    const user = await UserModel.findOne({ refreshtoken: refreshToken });
    if (user) {
      // Remove refresh token from user document
      user.refreshtoken = "";
      await user.save();
    }

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
export const editProfilePassword = async (req: Request, res: Response) => {
  const {previousPassword ,newPassword} = req.body;
  const userId = req.user?.userId; // Assuming user ID is stored in req.user by auth middleware

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
if (!previousPassword || !newPassword) {

 
    return res.status(400).json({ message: "Password not provided" });
  }
  const user  =await UserModel.findById(userId);
 if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
  try {
    const isPasswordValid = await bcrypt.compare(previousPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid previous password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

   

    res.json({
      message: "Password updated successfully",
      
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  const newUserData = {...req.body};
  const userId = req.user?.userId; // Assuming user ID is stored in req.user by auth middleware

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      newUserData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: { username: updatedUser.username, email: updatedUser.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};


