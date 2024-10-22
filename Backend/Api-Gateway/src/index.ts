import express from 'express';
import { createServer } from 'http';
import WebSocket from 'ws';
import { idempotencyMiddleware } from './middleware/idempotencyMiddleware';
import { topUpProxy } from './routes/route';

const app = express();
app.use(express.json());
app.use("/api-gateway/top-up", idempotencyMiddleware, topUpProxy);

// Create an HTTP server to host both the REST API and WebSocket server
const server = createServer(app)

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Map to store WebSocket connections for each user ID
const activeClients: Map<string, WebSocket> = new Map();

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log(`Client connected: ${ws}`);

    // Listen for messages from the client to register user ID
    ws.on('message', (message) => {
        const { userId } = JSON.parse(message.toString());
        console.log(`Client registered for userId: ${userId}`);
        activeClients.set(userId, ws);
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log(`Client disconnected: ${ws}`);
        // Remove disconnected client from active connections
        activeClients.forEach((client, userId) => {
            if (client === ws) {
                activeClients.delete(userId);
            }
        });
    });
});

// Endpoint to receive the bank token from Payment Service
app.post('/api-gateway/bank-token', (req, res) => {
    const { transactionId, token, userId } = req.body; // Include userId

    if (!transactionId || !token || !userId) {
        res.status(400).json({ error: 'Transaction ID, token, and user ID are required' });
        return;
    }

    const clientSocket = activeClients.get(userId);
    if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
        const redirectUrl = `https://bank.com/redirect?token=${token}`;
        clientSocket.send(JSON.stringify({ transactionId, redirectUrl, token }));
        console.log(`Sent bank token for transaction ID: ${transactionId} to client`);
    } else {
        console.error(`WebSocket connection for userId ${userId} is not open.`);
    }
    res.status(200).json({ message: 'Token received and sent to client' });
});

app.post('/wallet-service',async (req,res)=>{
    const amount = req.body.amount;
    const walletId = req.body.walletId;
    const userId = req.body.userId;

    const clientSocket = activeClients.get(userId);
    if(clientSocket && clientSocket.readyState === WebSocket.OPEN){
        clientSocket.send(JSON.stringify({amount,walletId}));
        console.log(`Sent amount to wallet service for walletId: ${walletId}`);
    }
    res.send({message: 'message  sent to frontend successfully'});
})
// Start the server
server.listen(8000, () => {
    console.log('API Gateway is running on port 8000');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    wss.clients.forEach(client => {
        client.close();
    });
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
