import express from "express";
import { connectDB,disconnectDB } from "./db";
import { topUpController } from "./controller/topUpController";

const app = express();

const PORT = 5007;

app.use(express.json());

app.post("/",topUpController);


async function startServer(){
    try {
        await connectDB();
        app.listen(PORT,()=>{
            console.log(`Payment server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error("Error starting the server: ", error);
        process.exit(1);
    }
}

startServer();