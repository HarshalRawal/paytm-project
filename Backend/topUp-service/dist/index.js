"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api-gateway/top-up", (req, res) => {
    console.log("Top-up service received a request");
    console.log("Request body: ", req.body);
    res.send("Top-up service received a request");
});
app.post("/", (req, res) => {
    console.log("hello from / ");
    console.log("Top-up service received a request");
    console.log("Request body: ", req.body);
    res.status(200).send("Top-up is successful");
});
app.listen(3001, () => {
    console.log('Top-up service is running on port 3001');
});
