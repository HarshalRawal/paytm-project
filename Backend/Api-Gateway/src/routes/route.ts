import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const topUpProxy = createProxyMiddleware({
    target: 'http://localhost:3001', // Replace with the actual Top-Up Service URL
    changeOrigin: true,
    selfHandleResponse: true, // Important: Ensures that the proxy doesn't automatically handle the response
    on: {
        proxyRes: async (proxyRes, req: Request, res: Response) => {
            let body: Uint8Array[] = []; // Use Uint8Array to handle binary data

            // Collect the response data from the Top-Up Service
            proxyRes.on('data', (chunk) => {
                body.push(chunk);
            });

            // Once the response is complete, process the data
            proxyRes.on('end', () => {
                const responseData = Buffer.concat(body).toString(); // Concatenate all chunks into a single string

                try {
                    // Parse the JSON response from Top-Up Service
                    const responseJson = JSON.parse(responseData);

                    // Log the response for debugging
                    console.log("Response from Top-Up Service:", responseJson);

                    // Send the final response back to the client through the API Gateway
                    res.status(proxyRes.statusCode ?? 200).json({
                        transactionId: responseJson.transactionId,
                        message: responseJson.message,
                        status: "processed" // You can customize the status based on your use case
                    });
                } catch (error) {
                    // Handle JSON parse error or unexpected issues
                    console.error("Error parsing response from Top-Up Service:", error);

                    // Send error response back to the client
                    if (!res.headersSent) {
                        res.status(500).json({ error: 'Internal Server Error' });
                    }
                }
            });

            // Handle errors during response handling
            proxyRes.on('error', (err) => {
                console.error("Error in proxy response:", err);

                // Ensure the client receives a proper error response
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Failed to process response from Top-Up Service' });
                }
            });
        }
    }
});
