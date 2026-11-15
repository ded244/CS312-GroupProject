import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import session from "express-session";
import db from "./db.js";

const app = express();
const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientDirectory = path.join(serverDirectory, "../client");
const clientBuildDirectory = path.join(clientDirectory, "dist");

app.use(session({
  secret: 'your-strong-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// json request body parser
app.use(express.json());
app.use(express.static(clientBuildDirectory));

// API routes for banking operations

// handle sign in
app.post("/api/login", async (req, res) => {
  try {
    const userId = String(req.body.user_id ?? "").trim();
    const password = String(req.body.password ?? "");

    if (!userId || !password) {
      return res.status(400).json({ error: "Enter both your user ID and password." });
    }

    const { rows } = await db.query(
      "SELECT user_id FROM users WHERE user_id = $1 AND password = $2",
      [userId, password]
    );

    if (rows[0]) {
      req.session.userId = rows[0].user_id;
      return res.json({ success: true, redirect: "/accounts" });
    }

    return res.status(401).json({ error: "Invalid user ID or password. Please try again." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
});

app.get("/api/accounts/:accountNumber/:routingNumber", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Sign in to view your account." });
  }

  try {
    const { accountNumber, routingNumber } = req.params;
    const accountResult = await db.query(
      `SELECT account_number, routing_number, account_name, account_type, balance
       FROM accounts
       WHERE account_number = $1 AND routing_number = $2 AND user_id = $3`,
      [accountNumber, routingNumber, req.session.userId]
    );

    if (!accountResult.rows[0]) {
      return res.status(404).json({ error: "Account not found." });
    }

    const transactionsResult = await db.query(
      `SELECT transaction_id, transaction_type, amount, location_of_purchase,
              category, transaction_date
       FROM transactions
       WHERE account_number = $1 AND routing_number = $2
       ORDER BY transaction_date DESC NULLS LAST, transaction_id DESC`,
      [accountNumber, routingNumber]
    );

    return res.json({ account: accountResult.rows[0], transactions: transactionsResult.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not load this account." });
  }
});

// serve react app
const sendReactApp = (req, res) => {
  res.sendFile(path.join(clientBuildDirectory, "index.html"));
};
app.get(["/", "/banking", "/login", "/accounts", "/accounts/overview", "/accounts/:accountNumber/:routingNumber"], sendReactApp);
export default app;
