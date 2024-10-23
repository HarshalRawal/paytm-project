import { Kafka } from 'kafkajs';
import { prisma } from '../db';
const kafka = new Kafka({
    clientId: 'top-up-service',
    brokers: ['localhost:9092']
});
const producer = kafka.producer();

export interface TopUpEvent {
    eventType: string;
    data:{
        walletId: string;
        topUpId: string;
        userId: string;
        amount: number;
        topUpStatus: string;
    }
}
export async function  produce(Event: TopUpEvent ) {
    try {
        await producer.send({
            topic: "top-up-transactions",
            messages:[{
                value: JSON.stringify(Event),
                key: Event.data.userId
            }]
        })
       console.log("Event produced successfully",Event); 
    } catch (error) {
        console.error("Error producing event: ", error);
        throw new Error("Error producing event");
    }
}

export async function connectProducer(){
    try {
        await producer.connect();
        console.log("Connected to Kafka producer");
    } catch (error) {
        console.error("Error connecting to Kafka producer: ", error);
        process.exit(1);
    }
}

export async function disconnectProducer(){
    try {
        await producer.disconnect();
        console.log("Disconnected from Kafka producer");
    } catch (error) {
        console.error("Error disconnecting from Kafka producer: ", error);
        process.exit(1);
    }
}

