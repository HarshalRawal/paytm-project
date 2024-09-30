import  express  from "express";
import {v4 as uuidv4} from "uuid"
import axios from "axios";

import { generateTransactionId } from "./bankFuncitons";
import { isSuccess } from "./bankFuncitons";

const app = express();
app.use(express.json())

app.post('/Demo-bank',(req,res)=>{
    console.log("req reached the bank server");
    const {userId , amount} = req.body;
    const token = uuidv4();
    res.send({token});
    return;
}) 

app.post('/url' , async(req , res)=>{
    
    const {userId , userName , bank} = req.body;
    console.log("req reached the bank url-request");
    
    const token = uuidv4()
    const transcationId = generateTransactionId();
    const url = `https://localhost:4563/?\?token=${token}`;

    res.send({url , transcationId});
    return;

})
app.post('/' , async (req , res) =>{
    const {cardNumber , expiry , cvv , transcationId , userId} = req.body;

    const success = isSuccess(cardNumber , expiry , cvv, transcationId , userId);

    if(!success){
        res.json({mssg : "Enter the valid card details or valid transaction Id"})
        return;
    }
    // check the types by zod and remove the if case so that the transaction may be either success or fail

    try {
        
        const sendStatus = await axios.post("http://localhost:4001/status" , {
            transcationId : transcationId ,
            userId : userId,
            status : success
        })

        if(sendStatus){
            res.send("success")
        }else{
            res.send("failed")
        }
    } catch (error) {
        res.status(401).json({err : "error is " + error});
        return;
    }



})


app.listen(4002);
console.log(" bank server is running on port 4002")