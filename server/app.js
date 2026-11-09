import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientDirectory = path.join(serverDirectory, "../client");
const clientBuildDirectory = path.join(clientDirectory, "dist");

// json request body parser
app.use(express.json());
app.use(express.static(clientBuildDirectory));

// API routes for banking operations
app.get(["/", "/banking", "/login", "/accounts", "/accounts/:accountId"], (req, res) => {
  res.sendFile(path.join(clientBuildDirectory, "index.html"));
});

export default app;