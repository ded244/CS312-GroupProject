import { useEffect, useState } from "react";
import "./AccountDetails.css";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function AccountDetails() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadAccounts() {
      try {
        const response = await fetch("/api/accounts", { signal: controller.signal });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Could not load your accounts.");
        }

        setAccounts(result.accounts);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Could not load your accounts.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadAccounts();
    return () => controller.abort();
  }, []);

  return (
    <main className="account-overview">
      <h1 className="account-overview__page-title">Account Overview</h1>
      <section className="account-overview__accounts" id="accounts" aria-label="Your accounts" aria-busy={loading}>
        <h2 className="account-overview__section-title">Your accounts</h2>
        {loading && <p role="status">Loading accounts...</p>}
        {error && <p className="account-overview__error" role="alert">{error}</p>}
        {!loading && !error && accounts.length === 0 && <p>You don't have any accounts yet.</p>}
        {!error && accounts.map((account) => (
          <a
            className="account-overview__account-card"
            href={`/accounts/${encodeURIComponent(account.account_number)}/${encodeURIComponent(account.routing_number)}`}
            key={`${account.account_number}-${account.routing_number}`}
          >
            <div className="account-overview__account-info">
              <span className="account-overview__account-name">{account.account_name}</span>
              <span className="account-overview__account-type">{account.account_type}</span>
              <span className="account-overview__account-number">Account number: {account.account_number}</span>
            </div>
            <span className="account-overview__account-balance">{money.format(Number(account.balance))}</span>
          </a>
        ))}
      </section>
    </main>
  );
}
