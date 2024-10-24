import { Kafka } from "kafkajs";
import { processPayment } from "../utils/processPayment";
import { checkIdempotency } from "../utils/idempotancy";
import { newPaymentRequest } from "../utils/newPayment";
export const kafka = new Kafka({
    clientId: "payment-service",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "payment-group" });

interface ConsumerEvent {
    eventType: string;
    data:{
        walletId: string;
        topUpId: string;
        userId: string;
        amount: number;
        topUpStatus: string;
    }
}

export async function connectConsumerKafka(){
    try {
        await consumer.connect();
        console.log("Consumer Connected to Kafka broker");
    } catch (error) {
        console.error("Error connecting to Kafka", error);
        process.exit(1);
    }
}

export async function disconnectConsumerKafka(){
    try {
        await consumer.disconnect();
        console.log("Consumer Disconnected from Kafka broker");
    } catch (error) {
        console.error("Error disconnecting from Kafka", error);
        process.exit(1);
    }
}

export async function subscribe(topic: string){
    try {
        await consumer.subscribe({ topic,fromBeginning: true} );
        console.log(`Consumer subscribed to topic: ${topic}`);
    } catch (error) {
        console.error("Error subscribing to topic", error);
        process.exit(1);
    }
}

// Import necessary modules and types // Assuming you have this utility

export async function consume() {
    try {
        // Subscribe to the "top-up-transactions" topic
        await subscribe("top-up-transactions");

        // Run the consumer to process each message
        await consumer.run({
            eachMessage: async ({ message }) => {
                const messageValue = message.value?.toString();
                if (messageValue) {
                    try {
                        // Parse the message and cast to the expected type
                        const parsedMessage = JSON.parse(messageValue) as ConsumerEvent;
                        const { userId, topUpId, walletId, amount, topUpStatus } = parsedMessage.data;

                        // Log the parsed message for visibility
                        console.log("Parsed Message:", parsedMessage);
                        // Call the idempotency check function
                        const isAlreadyProcessed = await checkIdempotency(topUpId);

                        if (isAlreadyProcessed) {
                            console.log(`Top-up ID ${topUpId} has already been processed. Skipping.`);
                            return;
                        }
                        const newPayment = await newPaymentRequest(parsedMessage);

                        // If not processed, handle further processing (e.g., payment processing)
                        // Retry logic if the bank is down
                        await processPayment( newPayment.id ,userId, amount,"top-up");

                    } catch (error) {
                        // Catch any JSON parsing or data processing errors
                        console.error("Error parsing or processing message:", error, "Raw message:", messageValue);
                    }
                } else {
                    console.error("Message value is null");
                }
            },
        });
    } catch (error) {
        // Handle subscription or consumer running errors
        console.error("Error consuming messages", error);
        process.exit(1); // Exit process on failure
    }
}

