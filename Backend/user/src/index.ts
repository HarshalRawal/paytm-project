import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import axios from 'axios';
import { z } from 'zod';


//resolve the cors error
import cors from 'cors'; // Correct import

const prisma = new PrismaClient();
const app = express();

app.use(express.json()); // To parse JSON request body
app.use(cors()); // Call the cors middleware

app.post('/new-user', async (req , res) => {

  const { name, email, password, phone } = req.body;

  try {
    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password, 
        phone: phone,
      }
    });

    // Make an HTTP request to the wallet service to create a wallet for the new user
    const newWalletResponse = await axios.post<string>("http://localhost:8080/create-wallet", {
      userId: newUser.userId
    });

    const walletId = newWalletResponse.data;

    // Update the newly created user with the walletId
    const updatedUser = await prisma.user.update({
      where: { userId: newUser.userId },
      data: { walletId: walletId } 
    });

    res.status(201).json(updatedUser);

  } catch (error) {
    console.error("Error creating user:",error);
    res.status(500).json({ error: "Error creating user" });
  }
});


// app.post('/sigup' , async(req, res)=>{
//   const 
// })

app.listen(6001, () => {
  console.log("Server running on port 6001");
});

function cors(): any {
  throw new Error('Function not implemented.');
}
