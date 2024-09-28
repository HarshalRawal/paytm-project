import express from "express";
import axios from "axios";

const app = express();

app.use(express.json())

app.post("/initiate-payment" , async(req ,res)=>{

    const {userId , userName , bank } = req.body;
    if(!userId || !bank){
        res.status(400).json({mssg : "Enter the valid user details or bank details"});
        return;
    }



    try {
        
        const userUrl = await axios.post("http://localhost:4002/url", {
            userId: userId,
            userName: userName,
            bank: bank,
        });

        
        res.json({ url: userUrl.data });

    } catch (error) {
        console.error("Error communicating with the bank server:", error);
        res.status(500).json({ msg: "Bank servers are down, please try again later." });
    }
        
    

} )


app.listen(4001);
console.log("server is running on port 4001");