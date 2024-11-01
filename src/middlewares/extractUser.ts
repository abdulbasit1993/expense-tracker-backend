import { Response, NextFunction } from "express";
import { getUserProfileRequest } from "../types/globalTypes";
import * as dotenv from "dotenv";
dotenv.config();
const jwt = require("jsonwebtoken");

export const extractUser = async (
  req: getUserProfileRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Invalid token",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }
};
