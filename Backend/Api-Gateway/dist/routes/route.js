"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.topUpProxy = void 0;
const http_proxy_middleware_1 = require("http-proxy-middleware");
exports.topUpProxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: 'http://localhost:3001', // Replace with the actual Top-Up Service URL
    changeOrigin: true,
    on: {
        proxyRes: (proxyRes, req, res) => __awaiter(void 0, void 0, void 0, function* () {
            let body = []; // Use Buffer array to collect response data
            // Collect the response data from the Top-Up Service
            proxyRes.on('data', (chunk) => {
                body.push(chunk);
            });
            // Once the response is complete, process the data
            proxyRes.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const responseData = Buffer.concat(body).toString(); // Concatenate all chunks into a single string
                try {
                    const responseJson = JSON.parse(responseData); // Parse the JSON response
                    // Log the response for debugging
                    console.log("Response from Top-Up Service:", responseJson);
                    // Send a response back to the client
                    const statusCode = (_a = proxyRes.statusCode) !== null && _a !== void 0 ? _a : 500; // Fallback to 500 if undefined
                    res.status(statusCode).json({
                        transactionId: responseJson.transactionId,
                        message: responseJson.message,
                        status: "processing" // Indicate that the request is being processed
                    });
                }
                catch (error) {
                    // Handle JSON parse error or unexpected issues
                    console.error("Error parsing response from Top-Up Service:", error);
                    // Check if response has already been sent
                    if (!res.headersSent) {
                        res.status(500).json({ error: 'Internal Server Error' });
                    }
                }
            }));
        })
    }
});
