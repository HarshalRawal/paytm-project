import express, { Request, Response } from "express";
import { verifySignature } from "./utils/verifySignature";
import { Kafka } from "kafkajs";
import { prisma } from "./db";
import cron from "node-cron";
import cors from "cors";
const app = express();
const PORT = 5001;
app.use(cors());
app.use(express.json());

// Enum for transaction types
enum TransactionType {
    credit = "credit",
    debit = "debit",
}

// Interface for the event payload
interface TransactionPayload {
    transactionId: string;
    userId: string;
    amount: number;
    transactionType: "credit" | "debit";  // Using the enum is also an option
}

// Interface for the full event
interface Event {
    id: string;
    transactionId: string;
    eventType: string;
    payload: TransactionPayload;  // Ensure payload conforms to TransactionPayload type
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const HMAC_SECRET = "mysecretkey"; // Load from environment variables

const kafka = new Kafka({
    clientId: "bank-webhook-handler",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();

async function connectKafkaAndDb() {
    try {
        await producer.connect();
        console.log("Connected to Kafka broker");

        await prisma.$connect();
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Error connecting to Kafka or database", error);
        process.exit(1);
    }
}

app.post("/api/BankWebhook",async (req: Request, res: Response) => {
    console.log("Received webhook request from bank");
    
    const signature = req.headers['bank-signature'];
    if (!signature || typeof signature !== "string") {
         res.status(400).json({ error: "Invalid or missing signature" });
         return;
    }   
    const payloadString = JSON.stringify(req.body)
    console.log("Payload String:", payloadString);

    const verifySignatureResult = verifySignature(payloadString, signature, HMAC_SECRET);
    if (!verifySignatureResult) {
         res.status(400).json({ error: "Invalid signature" });
         return;
    }

    const payload = JSON.parse(payloadString); // Parse the payload after verification
    const { transactionId, userId, status, amount, transactionType } = payload;

    // Validate required fields
    if (!transactionId || !userId || !status || !amount || !transactionType) {
         res.status(400).json({ error: "Missing required fields in payload" });
         return;
    }

    console.log("Received webhook payload:", payload);

    try {
        await prisma.$transaction(async (tx) => {
            const existingTransaction = await tx.transaction.findUnique({
                where: { id: transactionId },
            });

            if (!existingTransaction) {
                throw new Error("Transaction not found");
            }

            // await tx.transaction.update({
            //     where: { id: transactionId },
            //     data: { status },
            // });
            if(status==="success"){
             console.log(`Transaction ${transactionId} for user ${userId} updated to ${status} and amount ${amount} and transactionType ${transactionType}`);   
            await tx.outbox.create({
                data: {
                    transactionId,
                    eventType: "transaction_status_updated",
                    payload: {
                        userId,
                        transactionId, 
                        amount,
                        transactionType,
                    }
                },
            });
            }
        });
        res.status(200).json({ message: "Webhook processed successfully" });
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

async function publishOutboxEvents() {
    const outboxEvents = await prisma.outbox.findMany({
        where: {
            published: false,
            eventType: "transaction_status_updated",    
        },
    });

    for (const event of outboxEvents) {
        let attempts = 0;
        const maxRetries = 3;

        while (attempts < maxRetries) {
            try {
                const {transactionId,userId,amount,transactionType} = event.payload as unknown as TransactionPayload;
                await producer.send({
                    topic: "wallet-service-events",
                    messages: [
                        {
                            value: JSON.stringify({
                                transactionId,
                                userId,
                                amount,
                                transactionType,
                            }),
                        },
                    ],
                });

                // Mark the event as published
                await prisma.outbox.update({
                    where: { id: event.id },
                    data: { published: true },
                });

                console.log(`Successfully published event: ${event.id}`);
                break; // Exit retry loop if successful
            } catch (error) {
                attempts++;
                console.error(`Error publishing outbox event (attempt ${attempts}):`, error);
                await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            }
        }

        if (attempts === maxRetries) {
            console.error(`Failed to publish event after ${maxRetries} attempts: ${event.id}`);
        }
    }
}

// Set up a cron job to publish outbox events every minute
cron.schedule('* * * * *', async () => {
    console.log('Publishing outbox events...');
    await publishOutboxEvents();
});

app.listen(PORT, () => {
    console.log(`Bank-webhook-handler is running on port ${PORT}`);
});

async function start() {
    await connectKafkaAndDb();
    await publishOutboxEvents(); // Initial call if there are any events already present
}

process.on('SIGINT', async () => {
    console.log("Shutting down gracefully...");
    await producer.disconnect(); // Disconnect Kafka producer
    await prisma.$disconnect(); // Disconnect Prisma
    process.exit(0); // Exit process
});

start().catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
});
