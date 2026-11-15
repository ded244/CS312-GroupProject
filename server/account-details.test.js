import assert from "node:assert/strict";
import { test } from "node:test";
import app from "./app.js";
import db from "./db.js";

test("account details require a session and stay within the signed-in user's account", async (t) => {
  const originalQuery = db.query;
  const server = app.listen(0);
  t.after(async () => {
    db.query = originalQuery;
    await new Promise((resolve) => server.close(resolve));
  });

  db.query = async (sql, params) => {
    if (sql.includes("FROM users")) {
      return { rows: params[0] === "admin" && params[1] === "password" ? [{ user_id: "admin" }] : [] };
    }
    if (sql.includes("FROM accounts")) {
      assert.deepEqual(params.slice(1), ["000000001", "admin"]);
      return { rows: params[0] === "0000000001" ? [{
        account_number: "0000000001", routing_number: "000000001",
        account_name: "Checking", account_type: "checking", balance: "1250.00"
      }] : [] };
    }
    if (sql.includes("FROM transactions")) {
      assert.deepEqual(params, ["0000000001", "000000001"]);
      return { rows: [{ transaction_id: 1, transaction_type: "deposit", amount: "50.00" }] };
    }
    throw new Error("Unexpected query");
  };

  const base = `http://127.0.0.1:${server.address().port}`;
  const path = "/api/accounts/0000000001/000000001";
  assert.equal((await fetch(base + path)).status, 401);

  const login = await fetch(base + "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: "admin", password: "password" })
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie").split(";")[0];

  const account = await fetch(base + path, { headers: { Cookie: cookie } });
  assert.equal(account.status, 200);
  const details = await account.json();
  assert.equal(details.account.account_number, "0000000001");
  assert.equal(details.transactions.length, 1);

  const missing = await fetch(base + "/api/accounts/0000000002/000000001", { headers: { Cookie: cookie } });
  assert.equal(missing.status, 404);
});
