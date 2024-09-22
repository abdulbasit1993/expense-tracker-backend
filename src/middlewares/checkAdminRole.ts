import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
const jwt = require("jsonwebtoken");

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "An unknown error occured",
      });
    }
  }
};
