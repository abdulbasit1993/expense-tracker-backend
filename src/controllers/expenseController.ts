import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export const addExpenseCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
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
