import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

import dotenv from "dotenv";
dotenv.config();

const redis = Redis.fromEnv();  // it will automatically use UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from environment variables

const ratelimit = new Ratelimit({
    redis, 
    limiter: Ratelimit.slidingWindow(100, "60 s"), 
});

export default ratelimit;