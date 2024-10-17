import { Kafka } from "kafkajs";
import { prisma } from "./db/prisma";
import axios from "axios";

const kafka = new Kafka({
    clientId: "wallet-service",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "wallet-group" });

export async function connectKafka() {
    try {
        await consumer.connect();
        console.log("Connected to Kafka broker");
    } catch (error) {
        console.error("Error connecting to Kafka", error);
        process.exit(1);
    }
}

export async function disconnectKafka() {
    try {
        await consumer.disconnect();
        console.log("Disconnected from Kafka broker");
    } catch (error) {
        console.error("Error disconnecting from Kafka", error);
        process.exit(1);
    }
}

export async function consume() {
    await consumer.subscribe({ topic: "wallet-service-events" });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (!message.value) {
                return;
            }
            console.log(`Received message: ${message.value} from topic: ${topic}, partition: ${partition}`);
            const rawMessage = message.value.toString();
            console.log(`Received raw message: ${rawMessage}`);
            const event: WalletEvent = JSON.parse(rawMessage);
            const { transactionId, userId, amount, transactionType } = event;
            console.log(`Received event`);
            console.log(`Processing transaction: ${transactionId}, userId: ${userId}, amount: ${amount}, type: ${transactionType}`);
            try {
                const transaction = await prisma.transaction.findUnique({
                    where: { id: transactionId },
                });

                if (!transaction) {
                    console.error(`Transaction not found: ${transactionId}`);
                    return;
                }
                if(transaction.amount!=amount){
                    console.log(`Amount mismatch for transaction: ${transactionId}`);
                    return;
                }
                if (transaction.status == "success" || transaction.status== "failed" || transaction.amount != amount) {
                    console.log(`Skipping transaction: ${transactionId}, status: ${transaction.status}`);
                    return;
                }

                if (transactionType === "credit") {
                    await processCreditTransaction(transactionId, userId, amount);
                    try {
                        const response = await axios.post(`http://localhost:8000/wallet-service`, {
                            userId: userId,
                            amount: amount,
                            walletId: transaction.walletId,
                        });
                        console.log(`API Gateway notified successfully: ${response.status}`);
                    } catch (error) {
                        console.error("Error notifying API Gateway", error);
                    }
                }

              //  Handle other transaction types (e.g., debit) if needed

            } catch (error) {
                console.error("Error processing transaction", { error, transactionId, userId });
            }
        },
    });
}

async function processCreditTransaction(transactionId: string, userId: string, amount: number) {
    try {
        await prisma.$transaction(async (tx) => {
            await tx.transaction.update({
                where: { id: transactionId },
                data: { status: "success" },
            });
            await tx.wallet.update({
                where: { userId },
                data: { balance: { increment: amount } },
            });
        });
        console.log(`Credit transaction processed successfully: ${transactionId}, userId: ${userId}, amount: ${amount}`);
    } catch (error) {
        console.error("Error processing credit transaction", { error, transactionId, userId, amount });
    }
}

// Define the WalletEvent interface for type safety
interface WalletEvent {
    transactionId: string;
    userId: string;
    amount: number;
    transactionType: "credit" | "debit"; // Add more types if necessary
}
