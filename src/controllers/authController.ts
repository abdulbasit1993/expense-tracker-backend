import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { sendEmail } from "../services/sendEmail";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    const sanitizedEmail = email?.trim();
    const sanitizedPassword = password?.trim();
    const sanitizedName = name?.trim();

    if (!sanitizedEmail || !sanitizedPassword || !sanitizedName) {
      return res.status(400).json({
        success: false,
        message: "Fields cannot be empty",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = bcrypt.hashSync(sanitizedPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashedPassword,
        name: sanitizedName,
      },
    });

    let roleId: number;

    if (role) {
      const existingRole = await prisma.roles.findFirst({
        where: { type: role.toUpperCase() },
      });

      if (existingRole) {
        roleId = existingRole.id;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid Role Provided",
        });
      }
    } else {
      const defaultRole = await prisma.roles.findFirst({
        where: { type: "USER" },
      });

      if (!defaultRole) {
        const createdRole = await prisma.roles.create({
          data: { type: "USER" },
        });

        roleId = createdRole.id;
      } else {
        roleId = defaultRole.id;
      }
    }

    await prisma.userRole.create({
      data: {
        userId: newUser.id,
        roleId: roleId,
      },
    });

    const assignedRole = await prisma.roles.findFirst({
      where: { id: roleId },
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: assignedRole?.type || "USER",
      },
      user_token: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email: email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user?.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const token = jwt.sign(
      { userId: user?.id, email: user?.email },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    const role = user.roles[0]?.role?.type || null;

    return res.status(200).json({
      success: true,
      message: "Sign-in successful",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      user_token: token,
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

export const sendEmailWithOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const sanitizedEmail = email?.trim();

    if (!sanitizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email. Email is Required",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: sanitizedEmail },
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    const newOTP = await prisma.oTP.create({
      data: {
        otp: otp.toString(),
        userId: existingUser?.id,
      },
    });

    const subject = "Expense Tracker OTP Verification";
    const text = `Your 4 digit OTP code is ${otp}. Please use this code to complete your verification for resetting your account password. Please note that the OTP is valid for 10 minutes.`;

    const emailResponse = await sendEmail(
      "abasitm.1993@gmail.com",
      sanitizedEmail,
      subject,
      text
    );

    if (!emailResponse) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    return res.status(201).json({
      success: true,
      message: "OTP successfully generated and sent via email",
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

export const validateOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const sanitizedEmail = email?.trim();
    const sanitizedOtp = otp?.trim();

    if (!sanitizedEmail || !sanitizedOtp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: sanitizedEmail },
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const userId = existingUser?.id;

    const otpRecord = await prisma.oTP.findFirst({
      where: {
        userId: userId,
        otp: sanitizedOtp,
      },
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const otpCreationDate = otpRecord?.createdAt;

    const currentTime = new Date();
    const tenMinutesInMilliseconds = 10 * 60 * 1000;
    const timeDifference = currentTime.getTime() - otpCreationDate.getTime();

    if (timeDifference > tenMinutesInMilliseconds) {
      await prisma.oTP.delete({
        where: {
          id: otpRecord?.id,
        },
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    await prisma.oTP.delete({
      where: {
        id: otpRecord?.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "OTP is valid",
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

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    const sanitizedEmail = email?.trim();
    const sanitizedNewPassword = newPassword?.trim();

    if (!sanitizedEmail || !sanitizedNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and New Password are required",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: sanitizedEmail },
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const hashedNewPassword = bcrypt.hashSync(sanitizedNewPassword, 10);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedNewPassword },
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
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
