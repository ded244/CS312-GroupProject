import React from "react";
import { createRoot } from "react-dom/client";
import LoginPage from "./pages/LoginPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import AccountOverview from "./pages/AccountOverview.jsx";
import "./style.css";

/* header */
function Header() {
  const showNavigation = !["/", "/login"].includes(window.location.pathname);

  return (
    <header className="site-header">
      <a href="/accounts" className="site-header__brand" aria-label="Accounts home">
        <img src="/bank.png" alt="" />
      </a>
      {showNavigation && (
        <nav className="site-header__nav" aria-label="Main navigation">
          <a href="/accounts" aria-current="page">Accounts</a>
          <span>Payments</span>
          <span>Transfers</span>
          <span>Statements</span>
        </nav>
      )}
    </header>
  );
}

function App() {
  return (
    <>
      <Header />
      <AppContent />
    </>
  );
}

function AppContent() {
  const path = window.location.pathname;

  if (path === "/" || path === "/login") {
    return <LoginPage />;
  }
  if (path === "/accounts") {
    return <AccountOverview />;
  }
  const accountPath = path.match(/^\/accounts\/([^/]+)\/([^/]+)\/?$/);
  if (accountPath) {
    return <AccountPage accountNumber={decodeURIComponent(accountPath[1])} routingNumber={decodeURIComponent(accountPath[2])} />;
  }
  return <main><h1>Page not found</h1><a href="/login">Return to login</a></main>;
}

createRoot(document.getElementById("root")).render(<App />);
