import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { IUser, userType } from "../types/globalTypes";

const prisma = new PrismaClient();

export const addExpenseCategory = async (req: userType, res: Response) => {
  try {
    const { name } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { userId } = req.user;

    const sanitizedName = name.trim();

    if (!sanitizedName) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingExpenseCategory = await prisma.expenseCategory.findFirst({
      where: { name: sanitizedName },
    });

    if (existingExpenseCategory) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }

    const newExpenseCategory = await prisma.expenseCategory.create({
      data: {
        name: sanitizedName,
        createdBy: userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Expense Category added successfully",
      data: newExpenseCategory,
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

export const getAllExpenseCategories = async (req: Request, res: Response) => {
  try {
    const expenseCategories = await prisma.expenseCategory.findMany();

    return res.status(200).json({
      success: true,
      data: expenseCategories,
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

export const updateExpenseCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { name } = req.body;

    const sanitizedName = name.trim();

    if (!sanitizedName) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const sanitizedId = parseInt(id);

    const existingExpenseCategory = await prisma.expenseCategory.findFirst({
      where: { id: sanitizedId },
    });

    if (!existingExpenseCategory) {
      return res.status(400).json({
        success: false,
        message: "Category does not exist",
      });
    }

    const updatedExpenseCategory = await prisma.expenseCategory.update({
      where: { id: sanitizedId },
      data: { name: sanitizedName },
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedExpenseCategory,
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

export const deleteExpenseCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const sanitizedId = parseInt(id);

    const existingExpenseCategory = await prisma.expenseCategory.findFirst({
      where: { id: sanitizedId },
    });

    if (!existingExpenseCategory) {
      return res.status(400).json({
        success: false,
        message: "Category does not exist",
      });
    }

    const deletedExpenseCategory = await prisma.expenseCategory.delete({
      where: { id: sanitizedId },
    });

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
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
