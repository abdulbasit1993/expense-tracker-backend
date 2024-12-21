import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { userType } from "../types/globalTypes";

const prisma = new PrismaClient();

export const addNewIncome = async (req: userType, res: Response) => {
  try {
    const { title, description, date, amount, incomeSourceId } = req.body;

    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();

    if (!req.user || !req.user.userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { userId } = req.user;

    if (!sanitizedTitle) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    const incomeSource = await prisma.incomeSource.findUnique({
      where: { id: incomeSourceId },
    });

    if (!incomeSource) {
      return res.status(400).json({
        success: false,
        message: "Invalid Income Source ID",
      });
    }

    const newIncomeRecord = await prisma.income.create({
      data: {
        date: new Date(date),
        title: sanitizedTitle,
        description: sanitizedDescription,
        amount: amount,
        incomeSourceId: incomeSourceId,
        userId: userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Income added successfully",
      data: newIncomeRecord,
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
