import express, { Application, Request, Response } from 'express';
import { prisma } from './db';
import { topUpSchema } from './schema/schema';
import { connectProducer, disconnectProducer, produce, TopUpEvent } from './producer/producer';
import { connectDb, disconnectDb } from './db';
import { createTopup, getOutBox, isTopUpPayload } from './utils/utils';

export interface TopUpPayload {
    walletId: string;
    topUpId: string;
    userId: string;
    amount: number;
    topUpStatus: string;
}

const app: Application = express();
const PORT = 3005;

app.use(express.json());

async function startServer() {
    try {
        await connectDb();
        await connectProducer();
        app.listen(PORT, () => {
            console.log(`Top-up service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server: ", error);
        process.exit(1);
    }
}

async function handleTopUp(req: Request, res: Response) {
    console.log("Top-up service received a request from API Gateway");

    // Validate request body
    const validatedBody = topUpSchema.safeParse(req.body);
    if (!validatedBody.success) {
        res.status(400).json({ error: validatedBody.error.errors });
        return;
    }

    const { userId, amount, walletId } = validatedBody.data;

    try {
        // Note: ADD OUTBOX PATTERN HERE
        const { topUpId, status, outboxId } = await createTopup({ userId, amount, walletId });

        const { eventType, payload } = await getOutBox(outboxId);

        if (eventType && isTopUpPayload(payload)) {
            const event: TopUpEvent = { eventType, data: payload };

            try {
                await prisma.$transaction(async (prisma) => {
                    await produce(event);
                    await prisma.outbox.update({
                        where: { id: outboxId },
                        data: { published: true },
                    });
                });
            } catch (error) {
                console.error("Error producing event or updating Outbox: ", error);
                res.status(500).json({ error: 'Failed to produce event' });
                return;
            }
        }

        // Return response
        res.json({transactionId: topUpId,status: status});
        return;
    } catch (error) {
        console.error("Error in top-up service: ", error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
}

// Top-up service route
app.post('/', handleTopUp);

// Gracefully handle server termination and clean up resources
process.on('SIGINT', async () => {
    console.log("Shutting down gracefully...");
    try {
        await disconnectDb(); // Disconnect from the database
        await disconnectProducer(); // Disconnect from Kafka
    } catch (error) {
        console.error("Error during disconnection: ", error);
    } finally {
        process.exit(0); // Exit process regardless of success or failure
    }
});

// Start server
startServer();
