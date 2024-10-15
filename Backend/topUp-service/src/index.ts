import express, { Application } from 'express';
import { Request, Response } from 'express';
import { prisma } from './db';
import { topUpSchema } from './schema/schema';
import { Kafka } from 'kafkajs';
import { TransactionType } from '@prisma/client';

const app:Application = express();
const PORT = 3001;

// Initialize Kafka
const kafka = new Kafka({
    clientId: 'top-up-service',
    brokers: ['localhost:9092']
});
const producer = kafka.producer();

// Middleware to parse JSON bodies
app.use(express.json());

// Establish database connection once at startup
prisma.$connect()
    .then(() => console.log("Connected to the database successfully"))
    .catch((error) => {
        console.error("Error connecting to the database: ", error);
        process.exit(1); // Exit the process if the connection fails
    });

// Kafka producer connection
 producer.connect()
    .then(() => console.log("Kafka producer connected successfully"))
    .catch((error) => {
        console.error("Error connecting Kafka producer: ", error);
        process.exit(1); // Exit the process if the Kafka connection fails
    });

// Top-up service route
 app.post('/',async(req:Request,res:Response)=>{
    console.log("Top-up service received a request from API Gateway");
    // Validate request body
    const validatedBody = topUpSchema.safeParse(req.body);
    if (!validatedBody.success) {
         res.status(400).json({ error: validatedBody.error.errors });
         return;
    }

    const { userId, amount, walletId } = validatedBody.data;

    try {
        // Check if the user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
             res.status(404).json({ error: 'User not found' });
             return;
        }
      // Note :- ADD OUTBOX PATTERN HERE
        // Create a new transaction
        const newTransaction = await prisma.transaction.create({
            data: {
                amount: amount,
                userId: userId,
                transactionType: "credit",
                status: "processing",
                walletId: walletId
            }
        });

        // Send transaction details to Kafka topic
        await producer.send({
            topic: "top-up-transactions",
            messages: [{
                value: JSON.stringify({
                    transactionId: newTransaction.id,
                    userId: newTransaction.userId,
                    amount: newTransaction.amount,
                    walletId: newTransaction.walletId,
                    TransactionType: newTransaction.transactionType
                }),
                key: newTransaction.id // Optional key for Kafka partitioning
            }]
        });

        // Return response
        res.json({
            transactionId: newTransaction.id,
            status: newTransaction.status
        });
        return;
    } catch (error) {
        console.error("Error in top-up service: ", error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`Top-up service is running on port ${PORT}`);
});

// Gracefully handle server termination and clean up resources
process.on('SIGINT', async () => {
    console.log("Shutting down gracefully...");
    await producer.disconnect(); // Disconnect Kafka producer
    await prisma.$disconnect(); // Disconnect Prisma
    process.exit(0); // Exit process
});
