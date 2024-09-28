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
exports.idempotencyKeyExists = exports.updateIdempotencyKey = exports.getIdempotencyResponse = exports.storeIdempotencyKey = exports.get = exports.initRedisClient = void 0;
const redis_1 = require("redis");
let redisClient;
function initRedisClient() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!redisClient) {
            redisClient = (0, redis_1.createClient)({
                url: process.env.REDIS_URL
            });
            redisClient.on("error", (err) => {
                console.error("Error in Redis Client: ", err);
            });
            yield redisClient.connect();
            console.log("Redis Client Connected");
        }
        return redisClient;
    });
}
exports.initRedisClient = initRedisClient;
function get(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield initRedisClient();
        return yield client.get(key);
    });
}
exports.get = get;
function storeIdempotencyKey(idempotencyKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield initRedisClient();
        const interiumResponse = {
            status: "processing",
            message: "Request is being processed",
            createdAt: new Date().toISOString()
        };
        yield client.hSet(idempotencyKey, {
            status: interiumResponse.status,
            response: JSON.stringify(interiumResponse),
            createdAt: interiumResponse.createdAt
        });
        yield client.expire(idempotencyKey, 60);
    });
}
exports.storeIdempotencyKey = storeIdempotencyKey;
function getIdempotencyResponse(idempotencyKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield initRedisClient();
        const response = yield client.hGet(idempotencyKey, "response");
        if (response) {
            return JSON.parse(response);
        }
    });
}
exports.getIdempotencyResponse = getIdempotencyResponse;
function updateIdempotencyKey(idempotencyKey, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Initialize Redis client
            const client = yield initRedisClient();
            // Serialize the response into a JSON string
            const serializedResponse = JSON.stringify({
                statusCode: res.statusCode,
                headers: res.getHeaders(),
                body: res.json,
            });
            yield client.hSet(idempotencyKey, {
                status: res.statusMessage,
                interiumResponse: serializedResponse,
                updatedAt: new Date().toISOString()
            });
            yield client.expire(idempotencyKey, 1000);
            console.log(`Idempotency key '${idempotencyKey}' successfully updated in Redis.`);
        }
        catch (error) {
            console.error('Error updating idempotency key in Redis:', error);
            throw new Error('Failed to update idempotency key in Redis');
        }
    });
}
exports.updateIdempotencyKey = updateIdempotencyKey;
function idempotencyKeyExists(idempotencyKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield initRedisClient();
        return (yield client.exists(idempotencyKey)) === 1;
    });
}
exports.idempotencyKeyExists = idempotencyKeyExists;
