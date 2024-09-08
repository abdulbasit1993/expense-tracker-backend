import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
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

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
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

    return res.status(200).json({
      success: true,
      message: "Sign-in successful",
      data: user,
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
