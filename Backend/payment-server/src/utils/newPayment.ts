import { prisma } from "../db";

interface ConsumerEvent {
    eventType: string;
    data:{
        walletId: string;
        topUpId: string;
        userId: string;
        amount: number;
        topUpStatus: string;
    }
}
export async function newPaymentRequest(event: ConsumerEvent){
    try {
        const { walletId, topUpId, userId, amount, topUpStatus } = event.data;
        const newPayment =  await prisma.paymentRequest.create({
            data: {
                 userId: userId,
                 amount: amount,
                 transactionId:topUpId,
                 PaymentStatus:"PROCESSING",
                 PaymentType:"TOP_UP",
            }
        });
        return newPayment;
    } catch (error) {
        console.error("Error while creating a new Payment Entry in Database:",error);
        throw new Error("Failed to create payment");
    }

}