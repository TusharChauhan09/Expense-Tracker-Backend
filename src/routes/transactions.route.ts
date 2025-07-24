import express from "express";

const router = express.Router();

import { getTransactions, getTransactionsUserId , getTransactionsTransactionId, getTransacionsSummaryUserId } from "../controllers/transactions.controller";

router.get("/:userId", getTransactionsUserId);

router.post("/", getTransactions);

router.delete("/:id", getTransactionsTransactionId);

router.get("/summary/:userId", getTransacionsSummaryUserId);

export default router;
