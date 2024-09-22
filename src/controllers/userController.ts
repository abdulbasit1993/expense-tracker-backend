import { Response } from "express";
import { getUserProfileRequest } from "../types/globalTypes";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

export const getUserProfile = async (
  req: getUserProfileRequest,
  res: Response
) => {
  try {
    const { token } = req;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const { email, userId } = decodedToken;

    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (user) {
      return res.status(200).json({
        success: true,
        data: user,
      });
    }
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
