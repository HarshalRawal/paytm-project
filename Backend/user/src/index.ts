import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const app = express();

app.use(express.json()); // To parse JSON request body

app.post('/new-user', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password, // Ensure password is hashed in real-world scenarios
        phone: phone,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.listen(6001, () => {
  console.log("Server running on port 6001");
});