import express, { Request, Response } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();

app.use(cors()); // Enable CORS for all origins
app.use(express.json());

app.post('/new-user', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: { name, email, password, phone },
    });

    const newWalletResponse = await axios.post<string>(
      "http://localhost:8086/create-wallet",
      { userId: newUser.userId }
    );

    const walletId = newWalletResponse.data;

    const updatedUser = await prisma.user.update({
      where: { userId: newUser.userId },
      data: { walletId },
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.listen(6001, () => {
  console.log("Server running on port 6001");
});