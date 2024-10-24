import { prisma } from "../db"; // Assuming you're using Prisma for DB access

// Function to check idempotency based on the topUpId
export async function checkIdempotency(topUpId: string): Promise<boolean> {
    // Check if the top-up has already been processed in the database
   const existingPayment = await prisma.paymentRequest.findFirst({
      where:{
            transactionId: topUpId
      }
   })
    // Return true if the top-up ID has already been processed
    return !!existingPayment;
}
