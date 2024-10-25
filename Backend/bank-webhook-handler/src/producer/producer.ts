import { Kafka } from "kafkajs";
const kafka = new Kafka({
    clientId: "bank-webhook-handler",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();

export async function connectProducer(){
    try {
        await producer.connect();
        console.log(`Producer connected to Kafka broker successfully`);
    } catch (error) {
        console.error("Error connecting to Kafka Broker",error);
        process.exit(1);
    }
}

export async function disconnectProducer(){
    try {
        await producer.disconnect();
        console.log("Successfully disconnected from kafka broker");
    } catch (error) {
        console.error("Error disconnecting from kafka broker");
        process.exit(1);
    }
}


