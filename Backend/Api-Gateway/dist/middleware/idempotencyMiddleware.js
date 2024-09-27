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
exports.idempotencyMiddleware = void 0;
const redisClient_1 = require("../redisClient");
const redisClient_2 = require("../redisClient");
const redisClient_3 = require("../redisClient");
function idempotencyMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const idempotencyKey = req.headers["idempotency-key"];
        if (!idempotencyKey) {
            res.status(400).json({ error: "Idempotency key is required" });
            return;
        }
        try {
            const keyExists = yield (0, redisClient_1.idempotencyKeyExists)(idempotencyKey);
            if (keyExists) {
                const cashedResponse = yield (0, redisClient_2.getIdempotencyResponse)(idempotencyKey);
                res.status(200).json(cashedResponse);
                return;
            }
            yield (0, redisClient_3.storeIdempotencyKey)(idempotencyKey);
            res.status(202).json({ status: "processing", message: "Request is being processed", });
            next();
        }
        catch (error) {
            console.error("Error in idempotencyMiddleware: ", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}
exports.idempotencyMiddleware = idempotencyMiddleware;
