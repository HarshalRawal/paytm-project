import { sendTokenToGateway } from "./sendToken";
import axios from "axios";

interface BankResponse {
    token: string; // Assuming the bank sends back a token in the response
    // Add other properties as needed
}

export async function processPayment(transactionId: string, userId: string, amount: number,transactionType:string) {
    console.log("Processing payment for user:", userId, "Amount:", amount);

    try {
        const bankResponse = await axios.post<BankResponse>("http://localhost:4008/Demo-bank", {
            userId: userId,
            amount: amount,
        },{
            headers:{
                'Content-Type': 'application/json',
                'transactionType':transactionType
            }
        }
        );

        if (bankResponse && bankResponse.data && bankResponse.data.token && bankResponse.status === 200) {
            const { token } = bankResponse.data;
            console.log("Received token from bank:", token);
            await sendTokenToGateway(transactionId, token, userId);
        } else {
            console.error("Invalid bank response:", bankResponse);
        }
    } catch (error) {
        console.error("Error communicating with the bank server:", error);
        throw new Error("Error processing payment");
    }
}