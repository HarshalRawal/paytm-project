import express from "express";
import { connectKafka, disconnectKafka, consume } from "./consumer"; // Combined imports
import { connectDb } from "./db/prisma";
import { prisma } from "./db/prisma";

const app = express();
app.use(express.json());

// Health Check Endpoint
app.get("/health", async (req, res) => {
    try {
        // Optionally, check the health of Kafka and Database connections here
        res.status(200).send("Wallet service is healthy!");
    } catch (error) {
        res.status(500).send("Service is unhealthy");
    }
});

// Example route for top-up (add more routes as needed)
// app.post("/topup", handleTopUp); 

const PORT = process.env.PORT || 8085;

app.listen(PORT, () => {
    console.log(`Wallet service is running on port ${PORT}`);
});

async function start() {
    try {
        await connectKafka();
        await connectDb();
        console.log("Connected to Kafka and Database successfully");
    } catch (error) {
        console.error("Error starting the service:", error);
        process.exit(1); // Exit if unable to start
    }
}

process.on('SIGINT', async () => {
    console.log("Shutting down gracefully...");
    try {
        await disconnectKafka(); // Disconnect Kafka
        await prisma.$disconnect(); // Disconnect Prisma
        console.log("Disconnected from Kafka and Database");
    } catch (error) {
        console.error("Error during shutdown:", error);
    } finally {
        process.exit(0); // Exit process
    }
});

start()
    .then(consume)
    .catch(error => {
        console.error("Error during startup process:", error);
        process.exit(1); // Exit on startup failure
    });
