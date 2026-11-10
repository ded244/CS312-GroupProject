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

// serve react app
const sendReactApp = (req, res) => {
  res.sendFile(path.join(clientBuildDirectory, "index.html"));
};
app.get(["/", "/banking", "/login", "/accounts", "/accounts/:accountId"], sendReactApp);
export default app;