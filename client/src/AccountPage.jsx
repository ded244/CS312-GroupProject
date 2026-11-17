import React, { useEffect, useState } from "react";
import "./AccountPage.css";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function AccountPage({ accountNumber, routingNumber }) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAccount() {
      setLoading(true);
      setError("");
      setDetails(null);

      try {
        const response = await fetch(
          `/api/accounts/${encodeURIComponent(accountNumber)}/${encodeURIComponent(routingNumber)}`,
          { signal: controller.signal }
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Could not load this account.");
        }
        setDetails(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Could not load this account.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadAccount();
    return () => controller.abort();
  }, [accountNumber, routingNumber]);

  return (
    <main className="account-details">
      <a href="/accounts" className="account-details__back">&lt; Back to Accounts</a>
      {loading && <p role="status">Loading account...</p>}
      {error && <p className="account-details__error" role="alert">{error}</p>}
      {details && (
        <>
          <h1 id="account-name">{details.account.account_name}</h1>
          <div className="account-details__cards">
            <section className="account-details__card" aria-label="Available balance">
              <h2>Available Balance</h2>
              <p className="account-details__balance">{money.format(details.account.balance)}</p>
            </section>
            <section className="account-details__card" aria-label="Account information">
              <dl className="account-details__info">
                <div><dt>Account Number</dt><dd>{details.account.account_number}</dd></div>
                <div><dt>Routing Number</dt><dd>{details.account.routing_number}</dd></div>
                <div><dt>Account Type</dt><dd className="account-details__type">{details.account.account_type}</dd></div>
              </dl>
            </section>
          </div>
          <section className="account-details__transactions" aria-labelledby="transaction-heading">
            <h2 id="transaction-heading">Recent Transactions</h2>
            {details.transactions.length === 0 ? (
              <p>No transactions for this account yet.</p>
            ) : (
              <ul className="account-details__list">
                {details.transactions.map((transaction) => (
                  <li key={transaction.transaction_id} className="account-details__transaction">
                    <div>
                      <strong>{transaction.location_of_purchase || (transaction.transaction_type === "deposit" ? "Direct Deposit" : transaction.transaction_type === "transfer" ? "Transfer" : "Withdrawal")}</strong>
                      <small>{transaction.transaction_date ? new Date(transaction.transaction_date).toLocaleDateString("en-US") : "Date unavailable"}{transaction.category ? ` · ${transaction.category}` : ""}</small>
                    </div>
                    <span className={transaction.transaction_type === "deposit" ? "account-details__positive" : ""}>
                      {transaction.transaction_type === "withdrawal" || transaction.transaction_type === "transfer" ? "−" : "+"}{money.format(transaction.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
