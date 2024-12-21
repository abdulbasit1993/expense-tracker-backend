import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllIncomeCategories = async (req: Request, res: Response) => {
  try {
    const incomeCategories = await prisma.incomeSource.findMany();

    return res.status(200).json({
      success: true,
      data: incomeCategories,
    });
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
