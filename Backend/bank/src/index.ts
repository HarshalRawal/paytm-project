import  express  from "express";
import {v4 as uuidv4} from "uuid"

const app = express();
app.use(express.json())

app.post('/url' , async(req , res)=>{
    
    const {userId , userName , bank} = req.body;
    console.log("req reached the bank url-request");
    
    const token = uuidv4()
    const url = `https://localhost:4563/?\?token=${token}`;

    res.send(url);
    return;

})

app.listen(4002);
console.log(" bank server is running on port 4002")