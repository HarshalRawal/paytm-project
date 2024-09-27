"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topUpProxy = void 0;
const http_proxy_middleware_1 = require("http-proxy-middleware");
exports.topUpProxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: process.env.TOPUP_SERVICE_URL || "http://localhost:3001",
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req) => {
            console.log("Request is being proxied to top-up service");
        }
    }
});
