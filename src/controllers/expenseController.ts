import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { userType } from "../types/globalTypes";

const prisma = new PrismaClient();

export const addNewExpense = async (req: userType, res: Response) => {
  try {
    const { title, description, date, totalAmount, expenseCategoryId } =
      req.body;

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

    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total amount must be a positive number",
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
        totalAmount: totalAmount,
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

export const getAllExpensesOfUser = async (req: userType, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { userId } = req.user;

    const expenses = await prisma.expense.findMany({
      where: { userId: userId },
      include: {
        expenseCategory: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: expenses,
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

export const getSingleExpense = async (req: userType, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const sanitizedId = parseInt(id);

    if (isNaN(sanitizedId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const { userId } = req.user;

    const expense = await prisma.expense.findFirst({
      where: { id: sanitizedId, userId: userId },
      include: {
        expenseCategory: true,
      },
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: expense,
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

export const updateExpense = async (req: userType, res: Response) => {
  try {
    const { id } = req.query;
    const { title, description, date, totalAmount, expenseCategoryId } =
      req.body;

    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();

    if (!req.user || !req.user.userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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

    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total amount must be a positive number",
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

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const sanitizedId = parseInt(id);

    const existingExpense = await prisma.expense.findFirst({
      where: { id: sanitizedId },
    });

    if (!existingExpense) {
      return res.status(400).json({
        success: false,
        message: "Expense does not exist",
      });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: sanitizedId },
      data: {
        date: date,
        title: sanitizedTitle,
        description: sanitizedDescription,
        totalAmount: totalAmount,
        expenseCategoryId: expenseCategoryId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense,
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

export const deleteExpense = async (req: userType, res: Response) => {
  try {
    const { id } = req.query;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const sanitizedId = parseInt(id);

    const existingExpense = await prisma.expense.findFirst({
      where: { id: sanitizedId },
    });

    if (!existingExpense) {
      return res.status(400).json({
        success: false,
        message: "Expense does not exist",
      });
    }

    const deletedExpenseCategory = await prisma.expense.delete({
      where: { id: sanitizedId },
    });

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
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
