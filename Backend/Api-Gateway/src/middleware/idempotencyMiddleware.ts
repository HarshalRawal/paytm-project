import { NextFunction, Request, Response } from "express";
import { idempotencyKeyExists } from "../redisClient";
import { getIdempotencyResponse } from "../redisClient";
import { storeIdempotencyKey } from "../redisClient";
export async function idempotencyMiddleware(req:Request,res:Response,next:NextFunction):Promise<void>{
    const idempotencyKey = req.headers["idempotency-key"];
    if (!idempotencyKey) {
     res.status(400).json({error:"Idempotency key is required"})
     return;
    }
  try {
    const keyExists = await idempotencyKeyExists(idempotencyKey as string);
    if(keyExists){
        const cashedResponse = await getIdempotencyResponse(idempotencyKey as string);
        res.status(200).json(cashedResponse);
        return;
    }
    await storeIdempotencyKey(idempotencyKey as string);
    res.status(202).json({status:"processing",message:"Request is being processed",});
    next();
  } catch (error) {
    console.error("Error in idempotencyMiddleware: ",error);
    res.status(500).json({error:"Internal Server Error"});
  }
}