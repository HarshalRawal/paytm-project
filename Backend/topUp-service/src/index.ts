import express from 'express';
import { prisma } from './db';
import { topUpSchema } from './schema/schema';
const app  = express();
app.use(express.json());
app.post("/",async(req,res)=>{
console.log("Top-up service received a request from api-gateway");   
const validatedBody = topUpSchema.safeParse(req.body);
  if(!validatedBody.success){
    res.status(400).json({error: validatedBody.error.errors});
    return;
  }
    const {userId, amount,walletId} = validatedBody.data;
    const ExistingUser = await prisma.user.findUnique({
        where:{
            id: userId
        }
    })
    if(!ExistingUser){
        res.status(404).json({error: 'User not found'});
        return;
    }
   try {
    const newTransaction  = await prisma.transaction.create({
        data:{
           amount: amount,
           userId: userId,
           transactionType:"credit",
           status:"processing",
           walletId: walletId
        }
    })
    res.json(newTransaction);
    return;
   } catch (error) {
    console.log("Error in top-up service: ",error);
    res.status(500).json({error: 'Internal server error'});
   }  
})
  
app.listen(3001,()=>{
    console.log('Top-up service is running on port 3001');
})


