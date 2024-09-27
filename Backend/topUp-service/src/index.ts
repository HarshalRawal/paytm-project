import express from 'express';
const app  = express();
app.use(express.json());
app.post("/api-gateway/top-up",(req,res)=>{
    console.log("Top-up service received a request");
    console.log("Request body: ",req.body); 
    res.send("Top-up service received a request");
})
app.post("/",(req,res)=>{
  console.log("hello from / ")  
 console.log("Top-up service received a request");
 console.log("Request body: ",req.body);
 res.status(200).send("Top-up is successful");
})
app.listen(3001,()=>{
    console.log('Top-up service is running on port 3001');
})


