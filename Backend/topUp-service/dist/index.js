"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/", (req, res) => {
    console.log("Top-up service received a request");
    res.status(200).json({
        transactionId: "123456",
        message: "top-up initiated"
    });
});
app.listen(3001, () => {
    console.log('Top-up service is running on port 3001');
});
