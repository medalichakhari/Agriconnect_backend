import { Request, Response } from "express";
import prisma from "../prisma/client";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = "BUYER", location } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
        location,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};
