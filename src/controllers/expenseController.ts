import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { userType } from "../types/globalTypes";

const prisma = new PrismaClient();

export const addNewExpense = async (req: userType, res: Response) => {
  try {
    const { title, description, date, expenseCategoryId } = req.body;

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

    const expenseCategory = await prisma.expenseCategory.findUnique({
      where: { id: expenseCategoryId },
    });

    if (!expenseCategory) {
      return res.status(400).json({
        success: false,
        message: "Invalid Expense Category ID",
      });
    }

    const newExpense = await prisma.expense.create({
      data: {
        date: new Date(date),
        title: sanitizedTitle,
        description: sanitizedDescription,
        expenseCategoryId: expenseCategoryId,
        userId: userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: newExpense,
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
