import  express  from "express";
import {v4 as uuidv4} from "uuid"
import axios from "axios";
import * as crypto from "crypto";
import { generateTransactionId } from "./bankFuncitons";
import { isSuccess } from "./bankFuncitons";

const app = express();
app.use(express.json())

// Secret key for HMAC signing
const HMAC_SECRET = 'mysecretkey';

// Function to create HMAC SHA256 signature
function createSignature(payload:string) {
    return crypto.createHmac('sha256', HMAC_SECRET).update(payload).digest('hex');
}

app.post('/Demo-bank', (req, res) => {
    console.log("Request reached the bank server");

    try {
        // Validate the request body
        const { userId, amount } = req.body;
        if (!userId || !amount) {
            res.status(400).send({ error: "Missing required fields: userId and amount." });
            return;
        }

        const bankReferenceId = uuidv4();
        const tokenData = {
            userId,
            amount,
            bankReferenceId, // Include bankReferenceId in token data
        };

        const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');

        // Send the token and bankReferenceId back in the response
        res.status(200).send({
            token,
            bankReferenceId,
        });
        console.log(`Generated token: ${token} with userId: ${userId} and amount: ${amount} for tracking ID: ${bankReferenceId}`);
        return;
    } catch (error) {
        console.error("Error processing the request:", error);
        res.status(500).send({ error: "Internal Server Error" });
        return;
    }
})

// Simulate a bank transaction and send a webhook
app.post('/api/processTransaction', async (req, res) => {
    const { transactionId, userId, amount ,transactionType} = req.body;

    // Validate required fields
    if (!transactionId || !userId || !amount|| !transactionType) {
         res.status(400).json({ error: "Missing required fields in payload" });
         return
    }

    // Simulate processing transaction
    const status = 'success'; // Or 'FAILURE' depending on the transaction outcome

    // Prepare the payload for the webhook
    const payload = {
        transactionType,
        transactionId,
        userId,
        status,
        amount,
    };
    const payloadString = JSON.stringify(payload);
    
    console.log("Payload String:", payloadString);
    const signature = createSignature(payloadString);

    try {
        // Send the webhook notification to the bank-webhook-handler
        console.log("signature is " + signature);
        const respone  = await axios.post("http://localhost:5001/api/BankWebhook", JSON.stringify(payload), {
            headers: {
                'Content-Type': 'application/json', // Set the content type to application/json
                'bank-signature': signature,
            },
        });
        res.status(200).json({ message: 'Transaction processed and webhook sent successfully' });
        return;
    } catch (error) {
        console.error('Error sending webhook:', error);
        res.status(500).json({ error: 'Failed to send webhook notification' });
        return;
    }
});

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


app.listen(4008);
console.log(" bank server is running on port 4008")