import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const topUpProxy = createProxyMiddleware({
    target: 'http://localhost:3001', // Replace with the actual Top-Up Service URL
    changeOrigin: true,
    on: {
        proxyRes: async (proxyRes, req: Request, res: Response) => {
            let body: Buffer[] = []; // Use Buffer array to collect response data
            
            // Collect the response data from the Top-Up Service
            proxyRes.on('data', (chunk) => {
                body.push(chunk);
            });

            // Once the response is complete, process the data
            proxyRes.on('end', async () => {
                const responseData = Buffer.concat(body).toString(); // Concatenate all chunks into a single string

                try {
                    const responseJson = JSON.parse(responseData); // Parse the JSON response

                    // Log the response for debugging
                    console.log("Response from Top-Up Service:", responseJson);

                    // Send a response back to the client
                    const statusCode = proxyRes.statusCode ?? 500; // Fallback to 500 if undefined
                    res.status(statusCode).json({
                        transactionId: responseJson.transactionId,
                        message: responseJson.message,
                        status: "processing" // Indicate that the request is being processed
                    });

                } catch (error) {
                    // Handle JSON parse error or unexpected issues
                    console.error("Error parsing response from Top-Up Service:", error);
                    
                    // Check if response has already been sent
                    if (!res.headersSent) {
                        res.status(500).json({ error: 'Internal Server Error' });
                    }
                }
            });
        }
    }
});
