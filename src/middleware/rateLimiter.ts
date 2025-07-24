import ratelimit from "../lib/upstash";
import { Request, Response, NextFunction } from "express";

const rateLimiter = async (req:Request, res:Response, next: NextFunction) => {
    try{
        const ip = req.ip || "anonymous";
        const { success } = await ratelimit.limit(ip);
        if (!success) {
            return res.status(429).json({
                message: "Too many requests, please try again later.",
            });
        }
        next();
    }
    catch(error){
        console.log("Error in rate limiter:", error);
        next(error);
    }
}

export default rateLimiter;