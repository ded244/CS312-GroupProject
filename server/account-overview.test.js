import assert from "node:assert/strict";
import { test } from "node:test";
import app from "./app.js";
import db from "./db.js";

test("account overview returns only the signed-in user's accounts", async (t) => {
  const originalQuery = db.query;
  const server = app.listen(0);
  t.after(async () => {
    db.query = originalQuery;
    await new Promise((resolve) => server.close(resolve));
  });

  db.query = async (sql, params) => {
    if (sql.includes("FROM users")) {
      return { rows: params[1] === "password" ? [{ user_id: params[0] }] : [] };
    }
    if (sql.includes("FROM accounts")) {
      assert.match(sql, /WHERE user_id = \$1/);
      return { rows: [{
        account_number: params[0] === "admin" ? "0000000001" : "0000000003",
        routing_number: "000000001",
        account_name: "Checking",
        account_type: "checking",
        balance: "1250.00"
      }] };
    }
    throw new Error("Unexpected query");
  };

  const base = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(base + "/api/accounts")).status, 401);

  for (const [userId, expectedAccount] of [["admin", "0000000001"], ["john.doe", "0000000003"]]) {
    const login = await fetch(base + "/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, password: "password" })
    });
    assert.equal(login.status, 200);
    const cookie = login.headers.get("set-cookie").split(";")[0];
    const response = await fetch(base + "/api/accounts", { headers: { Cookie: cookie } });
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.accounts.length, 1);
    assert.equal(data.accounts[0].account_number, expectedAccount);
  }
});
