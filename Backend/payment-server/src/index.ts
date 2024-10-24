import express from "express";
import axios from "axios";
import { prisma } from "./db";
import { connectProducerKafka, disconnectProducerKafka } from "./producer/producer";
import { connectConsumerKafka, disconnectConsumerKafka, consume } from "./consumer/consumer";
import { connectDB, disconnectDB } from "./db";
import { processPayment } from "./utils/processPayment";

const app = express();
app.use(express.json());

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log("Shutting down gracefully...");
    try {
        await disconnectConsumerKafka(); // Disconnect Kafka consumer
        await disconnectProducerKafka(); // Disconnect Kafka producer
        await disconnectDB(); // Disconnect Prisma
    } catch (error) {
        console.error("Error during shutdown:", error);
    }
    process.exit(0); // Exit process
});

async function start() {
    try {
        await connectProducerKafka(); // Connect Kafka producer
        await connectConsumerKafka(); // Connect Kafka consumer
        await connectDB(); // Connect to DB

        // Start consuming messages after successful Kafka consumer connection
        await consume(); // This should begin consuming messages asynchronously

        // Start Express server
        app.listen(3003, () => {
            console.log("Payment service is running on port 3003");
        });

    } catch (error) {
        console.error("Error starting the service:", error);
        process.exit(1); // Exit with error status if something fails during startup
    }
}

start();
