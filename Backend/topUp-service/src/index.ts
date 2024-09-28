import express from 'express';
const app  = express();
app.use(express.json());
app.post("/",(req,res)=>{
 console.log("Top-up service received a request");
  res.status(200).json({
    transactionId: "123456",
    message:"top-up initiated"
  })
})
app.listen(3001,()=>{
    console.log('Top-up service is running on port 3001');
})


