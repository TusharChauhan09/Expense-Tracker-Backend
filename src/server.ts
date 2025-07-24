import express from "express";
import dotenv from "dotenv";

import rateLimiter from "./middleware/rateLimiter";

import transactionsRouter from "./routes/transactions.route";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(rateLimiter);

app.use('/api/transactions', transactionsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
