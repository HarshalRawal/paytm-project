import  express  from "express";
const app = express();
const PORT = 3000;
app.use(express.json());

app.post("/api/BankWebhook",(req,res)=>{
    
})