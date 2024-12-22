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

export const getAllIncomeOfUser = async (req: userType, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { userId } = req.user;

    const incomeRecord = await prisma.income.findMany({
      where: { userId: userId },
    });

    const filteredIncome = incomeRecord.map((record) => ({
      id: record.id,
      date: record.date,
      title: record.title,
      amount: record.amount,
      createdAt: record?.createdAt,
      updatedAt: record?.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      data: filteredIncome,
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

export const getSingleIncome = async (req: userType, res: Response) => {
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

    const income = await prisma.income.findFirst({
      where: { id: sanitizedId, userId: userId },
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: income,
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

export const updateIncome = async (req: userType, res: Response) => {
  try {
    const { id } = req.query;
    const { title, description, date, amount, incomeSourceId } = req.body;

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

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number",
      });
    }

    const incomeCategory = await prisma.incomeSource.findUnique({
      where: { id: incomeSourceId },
    });

    if (!incomeCategory) {
      return res.status(400).json({
        success: false,
        message: "Invalid Income Source Category ID",
      });
    }

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const sanitizedId = parseInt(id);

    const existingIncome = await prisma.income.findFirst({
      where: { id: sanitizedId },
    });

    if (!existingIncome) {
      return res.status(400).json({
        success: false,
        message: "Income does not exist",
      });
    }

    const updatedIncome = await prisma.income.update({
      where: { id: sanitizedId },
      data: {
        date: date,
        title: sanitizedTitle,
        description: sanitizedDescription,
        amount: amount,
        incomeSourceId: incomeSourceId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: updatedIncome,
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

export const deleteIncome = async (req: userType, res: Response) => {
  try {
    const { id } = req.query;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const sanitizedId = parseInt(id);

    const existingIncome = await prisma.income.findFirst({
      where: { id: sanitizedId },
    });

    if (!existingIncome) {
      return res.status(400).json({
        success: false,
        message: "Income does not exist",
      });
    }

    await prisma.income.delete({
      where: { id: sanitizedId },
    });

    return res.status(200).json({
      success: true,
      message: "Income deleted successfully",
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
