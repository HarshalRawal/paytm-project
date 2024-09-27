"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const idempotencyMiddleware_1 = require("./middleware/idempotencyMiddleware");
const route_1 = require("./routes/route");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api-gateway/top-up", idempotencyMiddleware_1.idempotencyMiddleware, route_1.topUpProxy);
app.listen(8000, () => {
    console.log('Api gateway is running on port 8000');
});
