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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const schema_1 = require("./schema/schema");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Top-up service received a request");
    const validatedBody = schema_1.topUpSchema.safeParse(req.body);
    if (!validatedBody.success) {
        res.status(400).json({ error: validatedBody.error.errors });
        return;
    }
    const { userId, amount, walletId } = validatedBody.data;
    const ExistingUser = yield db_1.prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!ExistingUser) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        const newTransaction = yield db_1.prisma.transaction.create({
            data: {
                amount: amount,
                userId: userId,
                transactionType: "credit",
                status: "processing",
                walletId: walletId
            }
        });
        res.json(newTransaction);
        return;
    }
    catch (error) {
        console.log("Error in top-up service: ", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.listen(3001, () => {
    console.log('Top-up service is running on port 3001');
});
