import axios from 'axios';
// Retry logic if api gateway is down
export async function sendTokenToGateway(transactionId: string, token: string, userId: string) {
    try {
        await axios.post('http://localhost:8080/api-gateway/bank-token', {
            transactionId,
            token,
            userId
        });
        console.log(`Token sent to API Gateway for transactionId: ${transactionId}`);
    } catch (error) {
        console.error("Error sending token to API Gateway:", error);
        throw new Error("Error sending token to API Gateway");  
    }
}