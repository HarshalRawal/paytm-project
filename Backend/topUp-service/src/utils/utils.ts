import { prisma } from "../db";
import { JsonValue } from "@prisma/client/runtime/library";

interface TopUpPayload {
    walletId: string;
    topUpId: string;
    userId: string;
    amount: number;
    topUpStatus: string;
}
interface TopUpRequest {
    userId: string;
    walletId: string;
    amount: number;
}
export async function createTopup(body: TopUpRequest) {
    try {
        const result = await prisma.$transaction(async (prisma) => {
            // Step 1: Create a new top-up request entry
            const newTopUp = await prisma.topUpRequest.create({
                data: {
                    userId: body.userId,
                    amount: body.amount,
                    TransactionStatus: "PROCESSING",
                }
            });

            // Step 2: Create a new outbox entry for the Kafka event
            const newOutbox = await prisma.outbox.create({
                data: {
                    eventType: "top-up-initiated",
                    payload: {
                        walletId: body.walletId,
                        topUpId: newTopUp.id,
                        userId: body.userId,
                        amount: body.amount,
                        topUpStatus: "PROCESSING"
                    }
                }
            });

            return { topUpId: newTopUp.id, status: "PROCESSING", outboxId: newOutbox.id };
        });

        console.log("New Top-up Entry created in Database:", result);
        return result;  // Return the result of the transaction

    } catch (error) {
        console.error("Error while creating a new Top-up Entry in Database:",error);
        // Optionally, you could return an error response or throw a custom error
        throw new Error("Failed to create top-up");
    }
}

export async function getOutBox(outboxId: string) {
    try{
         const outboxEntry = await prisma.outbox.findUnique({
            where:{
                id: outboxId
            }
         });
        console.log("Fetched outbox entries:")
        return {eventType: outboxEntry?.eventType, payload: outboxEntry?.payload};
    }
    catch(error){
        console.error("Error while fetching outbox entries:",error);
        throw new Error("Failed to fetch outbox entries");
    }
}


export function isTopUpPayload(payload: unknown): payload is TopUpPayload {
    // Check if payload is an object and not null
    if (typeof payload !== 'object' || payload === null) return false;

    // Type assertion to treat payload as an object for further checks
    const obj = payload as Record<string, unknown>;

    return (
        typeof obj.walletId === 'string' &&
        typeof obj.topUpId === 'string' &&
        typeof obj.userId === 'string' &&
        typeof obj.amount === 'number' &&
        typeof obj.topUpStatus === 'string'
    );
}