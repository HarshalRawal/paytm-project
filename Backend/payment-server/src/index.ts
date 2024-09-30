import express from "express";
import axios from "axios";
import { prisma } from "./db";
import { Kafka } from "kafkajs";

const app = express();
app.use(express.json());

const kafka = new Kafka({
    clientId: "payment-service",
    brokers: ["localhost:9092"],
});

interface BankResponse {
    token: string; // Assuming the bank sends back a token in the response
    // Add other properties as needed
}

const consumer = kafka.consumer({ groupId: "payment-group" });

// Connect to Kafka and Database
async function connectKafkaAndDb() {
    try {
        await consumer.connect();
        console.log("Connected to Kafka broker");

        await prisma.$connect();
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Error connecting to Kafka or database", error);
        process.exit(1); // Exit the process on failure
    }
}

// Consume messages from Kafka
async function consumeMessages() {
    await consumer.subscribe({ topic: "top-up-transactions", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                console.log(`Message received from topic ${topic}, partition ${partition}`);

                const messageValue = message.value?.toString();

                if (messageValue) {
                    const parsedMessage = JSON.parse(messageValue);
                    const { userId, amount, transactionId } = parsedMessage;
                    console.log("Parsed Message:", parsedMessage);

                    // Process the payment based on the consumed message
                    await processPayment(transactionId, userId, amount);
                } else {
                    console.error("Message value is null");
                }
            } catch (error) {
                console.error("Error processing message", error);
            }
        }
    });
}

// Sending token to API Gateway
async function sendTokenToGateway(transactionId: string, token: string, userId: string) {
    try {
        await axios.post('http://localhost:8000/api-gateway/bank-token', {
            transactionId,
            token,
            userId
        });
        console.log(`Token sent to API Gateway for transactionId: ${transactionId}`);
    } catch (error) {
        console.error("Error sending token to API Gateway:", error);
    }
}

// Process the payment based on the consumed message
async function processPayment(transactionId: string, userId: string, amount: number) {
    console.log("Processing payment for user:", userId, "Amount:", amount);

    try {
        const bankResponse = await axios.post<BankResponse>("http://localhost:4002/Demo-bank", {
            userId: userId,
            amount: amount,
        });

        if (bankResponse && bankResponse.data && bankResponse.data.token) {
            const { token } = bankResponse.data;
            console.log("Received token from bank:", token);
            await sendTokenToGateway(transactionId, token, userId);
        } else {
            console.error("Invalid bank response:", bankResponse);
        }
    } catch (error) {
        console.error("Error communicating with the bank server:", error);
    }
}

// app.post("/status", async (req, res) => {
//     const { status, transactionId, userId } = req.body;

//     console.log("Received status update:", { status, transactionId, userId });

//     if (!transactionId || !userId) {
//         res.status(400).json({ error: 'Transaction ID and User ID are required' });
//         return;
//     }

//     try {
//         // Update the transaction status in the database
//         await prisma.transaction.update({
//             where: { transactionId_userId: { transactionId, userId } }, // Adjust your unique key as needed
//             data: { status }
//         });
//         console.log(`Transaction ${transactionId} for user ${userId} updated to ${status}`);

//         if (status === 'success') {
//             res.status(200).json({ message: 'Payment successful' });
//         } else {
//             res.status(400).json({ message: 'Payment failed' });
//         }
//     } catch (error) {
//         console.error("Error updating transaction status in database:", error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log("Shutting down gracefully...");
    await consumer.disconnect(); // Disconnect Kafka consumer
    await prisma.$disconnect(); // Disconnect Prisma
    process.exit(0); // Exit process
});

async function start() {
    await connectKafkaAndDb();
    await consumeMessages();

    app.listen(3002, () => {
        console.log("Payment service is running on port 3002");
    });
}

start().catch(error => {
    console.error("Error starting the service:", error);
});
