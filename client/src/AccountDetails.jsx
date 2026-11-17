import "./AccountDetails.css";

const accounts = [
  { name: "Everyday Checking", number: "•••• 4821", balance: "$2,450.75", type: "checking" },
  { name: "Savings", number: "•••• 1906", balance: "$8,320.00", type: "savings" },
];

const transactions = [
  { name: "Grocery Market", date: "Today", amount: "−$64.28", type: "negative" },
  { name: "Paycheck", date: "Yesterday", amount: "+$1,850.00", type: "positive" },
  { name: "Coffee House", date: "Nov 12", amount: "−$5.50", type: "negative" },
];

const spendingCategories = [
  { name: "Housing", color: "#1565c0" },
  { name: "Food", color: "#0ab618" },
  { name: "Transport", color: "#fdd835" },
  { name: "Other", color: "#c0147e" },
];

export default function AccountDetails() {
  return (
    <main className="account-overview">
      <h1 className="account-overview__page-title">Account Overview</h1>

      <div className="account-overview__content">
        <section className="account-overview__left" id="accounts" aria-label="Account details">
          <p className="account-overview__summary-text">Welcome back. Here is your banking summary.</p>
          <h2 className="account-overview__section-title">Your accounts</h2>

          {accounts.map((account) => (
            <article className="account-overview__account-card" key={account.type}>
              <div className="account-overview__account-info">
                <span className={`account-overview__account-color account-overview__account-color--${account.type}`} aria-hidden="true" />
                <div>
                  <h3 className="account-overview__account-name">{account.name}</h3>
                  <p className="account-overview__summary-text">{account.number}</p>
                </div>
              </div>
              <span className="account-overview__account-balance">{account.balance}</span>
              <span className="account-overview__account-arrow" aria-hidden="true">›</span>
            </article>
          ))}

          <section className="account-overview__details-card" aria-label="Account summary">
            <h2 className="account-overview__section-title">Account summary</h2>
            <div className="account-overview__details-row">
              <span className="account-overview__details-label">Total balance</span>
              <span className="account-overview__details-value">$10,770.75</span>
            </div>
            <div className="account-overview__details-row">
              <span className="account-overview__details-label">Available credit</span>
              <span className="account-overview__details-value">$4,200.00</span>
            </div>
            <div className="account-overview__details-row">
              <span className="account-overview__details-label">Next payment</span>
              <span className="account-overview__details-value">Dec 1, 2026</span>
            </div>
          </section>

          <section className="account-overview__transactions" id="transactions">
            <h2 className="account-overview__section-title">Recent transactions</h2>
            {transactions.map((transaction) => (
              <article className="account-overview__transaction-card" key={`${transaction.name}-${transaction.date}`}>
                <span>
                  <span className="account-overview__transaction-name">{transaction.name}</span>
                  <br />
                  <small>{transaction.date}</small>
                </span>
                <span className={`account-overview__transaction-amount account-overview__transaction-amount--${transaction.type}`}>
                  {transaction.amount}
                </span>
              </article>
            ))}
          </section>
        </section>

        <aside className="account-overview__right" id="insights" aria-label="Spending insights">
          <section className="account-overview__insights-card">
            <h2 className="account-overview__insights-title">Spending this month</h2>
            <p className="account-overview__month-total">$1,284</p>
            <div
              className="account-overview__chart"
              role="img"
              aria-label="Spending breakdown by category"
            />
            <ul className="account-overview__legend">
              {spendingCategories.map((category) => (
                <li className="account-overview__legend-item" key={category.name}>
                  <span
                    className="account-overview__legend-color"
                    style={{ backgroundColor: category.color }}
                    aria-hidden="true"
                  />
                  {category.name}
                </li>
              ))}
            </ul>
            <button className="account-overview__button" type="button">View spending details</button>
          </section>
        </aside>
      </div>
    </main>
  );
}
