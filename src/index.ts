import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("AgriConnect API is running ✅");
});

app.get("/users", async (_, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;
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
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ message: "Could not create user" });
  }
});

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err);
    process.exit(1);
  }
}

startServer();
