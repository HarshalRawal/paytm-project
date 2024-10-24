import { kafka } from "../consumer/consumer"

const producer = kafka.producer()

export async function connectProducerKafka(){
    try {
        await producer.connect()
        console.log(" Producer Connected to Kafka producer")
    } catch (error) {
        console.error("Error connecting to Kafka producer", error)
        process.exit(1)
    }
}

export async function disconnectProducerKafka(){
    try {
        await producer.disconnect()
        console.log(" Producer Disconnected from Kafka broker")
    } catch (error) {
        console.error("Error disconnecting from Kafka producer", error)
        process.exit(1)
    }
}