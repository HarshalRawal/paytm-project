import express from 'express';
import { idempotencyMiddleware } from './middleware/idempotencyMiddleware';
import { topUpProxy } from './routes/route';
const app = express();

app.use(express.json());

app.use("/api-gateway/top-up",idempotencyMiddleware,topUpProxy)
app.listen(8000,()=>{
    console.log('Api gateway is running on port 8000');
})