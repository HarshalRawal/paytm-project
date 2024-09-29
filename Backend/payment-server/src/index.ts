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
                    const { userId, amount } = parsedMessage;
                    console.log("Parsed Message:", parsedMessage);

                    // Process the payment based on the consumed message
                    // await processPayment(userId, amount);
                    console.log("successfully processed the payment");
                } else {
                    console.error("Message value is null");
                }
            } catch (error) {
                console.error("Error processing message", error);
            }
        }
    });
}

// Process the payment based on the consumed message
async function processPayment(userId: string, amount: number) {
    console.log("Processing payment for user:", userId);

    try {
        // Simulate communication with bank service
        const bankResponse = await axios.post("http://localhost:4002/url", {
            userId: userId,
            amount: amount,
        });

        console.log("Bank response:", bankResponse.data);

        // Store the transaction in the database
        // await prisma.transaction.update({
        //     data: {
        //         userId: userId,
        //         amount: amount,
        //         status: "success", // Set status based on business logic
        //         transactionType: "debit",
        //     }
        // });

        console.log("Transaction stored successfully for user:", userId);
    } catch (error) {
        console.error("Error communicating with the bank server or storing the transaction:", error);
    }
}   
// app.post("/initiate-payment" , async(req ,res)=>{

//     const {userId , userName , bank } = req.body;
//     if(!userId || !bank){
//         res.status(400).json({mssg : "Enter the valid user details or bank details"});
//         return;
//     }
    
//     try {
        
//         const bankResponse  = await axios.post("http://localhost:4002/url", {
//             userId: userId,
//             userName: userName,
//             bank: bank,
//         });

//         res.json({ url: bankResponse.data });
//         //store the trancation Id , userId , status id in the db

//     } catch (error) {
//         console.error("Error communicating with the bank server:", error);
//         res.status(500).json({ msg: "Bank servers are down, please try again later." });
//     }
        
// } )

app.post("/status" , async(req , res)=>{
    const {status , transcationId , userId } = req.body;

    //In db :  find the particular transcation using transactionId , userId and mark the satatus 
    console.log("reached the post status request")
    if (status === 'success') {
        res.json({ message: 'Payment successful' });
      } else {
        res.json({ message: 'Payment failed' });
    }
})

process.on('SIGINT', async () => {
    console.log("Shutting down gracefully...");
    await consumer.disconnect(); // Disconnect Kafka producer
    await prisma.$disconnect(); // Disconnect Prisma
    process.exit(0); // Exit process
});



app.listen(4001,()=>{
    console.log("server is running on port 4001");
});
