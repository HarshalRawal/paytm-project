import z from 'zod';

export const topUpSchema = z.object({
   amount: z.number({message: 'Amount must be a number'}),
   userId: z.string({message: 'User ID must be a string'}),
   walletId: z.string({message: 'Wallet ID must be a string'}),
});

