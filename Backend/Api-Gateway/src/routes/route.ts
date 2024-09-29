import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Define the proxy middleware
export const topUpProxy = createProxyMiddleware({
  target: 'http://localhost:3001/', // Replace with the actual Top-Up Service URL
  changeOrigin: true,
  selfHandleResponse: true, // Ensure we handle the response manually
  on: {
    proxyReq: (proxyReq, req: Request) => {
      console.log("Request received in API Gateway:", req.body);
      console.log("Forwarding request to Top-Up Service");

      // Ensure that the proxy request forwards the body correctly
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        // Update the headers in the proxy request
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        // Write the body to the proxy request
        proxyReq.write(bodyData);
      }
    },

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

          // Copy response headers from the proxy response to the client response
          Object.keys(proxyRes.headers).forEach((key) => {
            res.setHeader(key, proxyRes.headers[key] as string);
          });

          // Send the final response back to the client through the API Gateway
          res.status(proxyRes.statusCode ?? 200).json(responseJson);
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
    },
  }
});
