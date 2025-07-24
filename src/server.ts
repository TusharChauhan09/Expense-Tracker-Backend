import express from "express";
import dotenv from "dotenv";
import job from "./config/cron";

import rateLimiter from "./middleware/rateLimiter";

import transactionsRouter from "./routes/transactions.route";

dotenv.config();

const app = express();

if(process.env.NODE_ENV === "production") job.start


const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(rateLimiter);

app.get('/api/recall',(req,res)=>{
  res.status(200).json({status: "ok"});
})

app.use('/api/transactions', transactionsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
