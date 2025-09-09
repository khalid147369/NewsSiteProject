import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "./models/user";

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
       res.status(401).json({ message: "Refresh token not provided" });
        return;
    }

    // Verify refresh token
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || "default_refresh_secret"
    );
    const user = await UserModel.findOne({
      _id: decoded.userId,
      refreshtoken: token,
    });
    if (!user) {
       res.status(403).json({ message: "Invalid refresh token" });
        return;
    }

    // Issue new access token
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, email: user.email ,role: user.roles },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "15m" }
    );

    res.json({
      message: "refreshtoken successful",
      user: { username: user.username, email: user.email, role: user.roles },
      accessToken,
    });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
