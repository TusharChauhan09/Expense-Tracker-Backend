import { Request, Response } from "express";
import { client } from "../lib/db"; 
import { z } from "zod";

export const getTransactionsUserId  = async (req: Request, res:Response) => {
  try {
    const { userId } = req.params;

    const transactions = await client.transaction.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (transactions.length === 0) {
      return res.status(400).json({
        message: "User Does not exist",
      });
    }

    res.status(200).json({
      message: "Fetched the trasnsations successfully",
      transactions,
    });
  } catch (error) {
    console.error("Error getting the transaction:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export const getTransactions  =  async (req: Request, res:Response) => {
  try {
    const transactionSchema = z.object({
      title: z.string().min(1, "Title is required"),
      amount: z.number(),
      user_id: z.string().min(1, "Invalid user ID format"),
      category: z.string().min(1, "category is required"),
    });

    const result = transactionSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request data",
      });
    }

    const { title, amount, user_id, category } = result.data;

    const transaction = await client.transaction.create({
      data: {
        user_id,
        title,
        amount,
        category,
      },
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getTransactionsTransactionId  = async (req: Request, res:Response) => {
  try {
    const { id } = req.params;

    const existing = await client.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Transaction ID does not exist",
      });
    }

    const target = await client.transaction.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Transaction deleted successfully",
      target,
    });
  } catch (error) {
    console.error("Error in deleting transaction:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getTransacionsSummaryUserId  = async (req: Request, res:Response) => {
  try {
    const { userId } = req.params;

    const balanceResult = await client.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        user_id: userId,
      },
    });
    const balance = balanceResult._sum.amount ?? 0;

    const incomeResult = await client.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        user_id: userId,
        amount: {
          gt: 0,
        },
      },
    });
    const income = incomeResult._sum.amount ?? 0;

    const expenseResult = await client.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        user_id: userId,
        amount: {
          lt: 0,
        },
      },
    });
    const expense = expenseResult._sum.amount ?? 0;

    res.status(200).json({
      message: "Fetched the summary successfully",
      balance,
      income,
      expenses: expense,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};