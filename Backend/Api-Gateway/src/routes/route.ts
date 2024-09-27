import { createProxyMiddleware} from "http-proxy-middleware";
import { updateIdempotencyKey } from "../redisClient";
import { Response } from "express";

export const topUpProxy = createProxyMiddleware({
    target: process.env.TOPUP_SERVICE_URL||"http://localhost:3001",
    changeOrigin: true,
    on:{
       proxyReq: (proxyReq, req) => {
        console.log("Request is being proxied to top-up service");
       }
    }
})
