import dotenv from "dotenv";
import express from "express";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

// middleware to parse JSON body from incoming requests
app.use(rateLimiter);
app.use(express.json());
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on  port ", PORT);
  });
});
