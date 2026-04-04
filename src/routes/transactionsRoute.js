import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionsByUserId,
  getTransactionsSummary,
} from "../controller/transactionsController.js";

const router = express.Router();

// get all transactions for a user
router.get("/:user_id", getTransactionsByUserId);

// add a new transaction
router.post("/", createTransaction);

// delete a transaction
router.delete("/:id", deleteTransaction);

// get transactions summary for a user
router.get("/summary/:userId", getTransactionsSummary);

export default router;
