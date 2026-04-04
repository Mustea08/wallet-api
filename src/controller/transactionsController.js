import { sql } from "../config/db.js";

export const getTransactionsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log("user_id========", user_id);

    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC`; // select all transactions for a user and order them by created_at in descending order
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error fetching transactions", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

export const createTransaction = async (req, res) => {
  try {
    console.log("req.body", req.body);

    const { user_id, title, amount, category } = req.body;
    if (!user_id || !title || !amount || category === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const transaction =
      await sql`INSERT INTO transactions (user_id, title, amount, category)
     VALUES (${user_id}, ${title}, ${amount}, ${category})
     RETURNING *`;
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error adding transaction", error);
    res.status(500).json({ message: "Error adding transaction" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }
    const transaction =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`; // delete a transaction and return the deleted transaction
    if (transaction.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting transaction", error);
    res.status(500).json({ message: "Error deleting transaction" });
  }
};

export const getTransactionsSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    if (isNaN(parseInt(userId))) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}`;

    const incomeResult =
      await sql`SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0`;
    const expenseResult =
      await sql`SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0`;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });
  } catch (error) {
    console.log("Error fetching transactions summary", error);
    res.status(500).json({ message: "Error fetching transactions summary" });
  }
};
