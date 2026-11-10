import React from "react";
import { createRoot } from "react-dom/client";
import LoginPage from "./pages/LoginPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import AccountOverview from "./pages/AccountOverview.jsx";
import "./style.css";

/* header */
function Header() {
  return (
    <header>
      <img src="/bank.png" alt="Logo" />
    </header>
  );
}

/* footer */
function Footer() {
  return (
    <footer>
      <p>Test Footer</p>
    </footer>
  );
}

function App() {
  return (
    <>
      <Header />
      <AppContent />
      <Footer />
    </>
  );
}

function AppContent() {
  const path = window.location.pathname;

  if (path === "/" || path === "/login") {
    return <LoginPage />;
  }
  if (path === "/accounts") {
    return <AccountPage />;
  }
  if (path === "/accounts/overview") {
    return <AccountOverview />;
  }
  return <main><h1>Page not found</h1><a href="/login">Return to login</a></main>;
}

createRoot(document.getElementById("root")).render(<App />);
