import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import { userType } from "../types/globalTypes";
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

export const checkAdmin = async (
  req: userType,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded?.userId;

    req.user = decoded;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userWithRoles = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!userWithRoles) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hasAdminRole = userWithRoles.roles.some(
      (userRole) => userRole.role.type === "ADMIN"
    );

    if (!hasAdminRole) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have the required admin privileges",
      });
    }

    next();
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
