import React, { useState } from "react";
import "./LoginPage.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({ user_id: "", password: "" });
  const [error, setError] = useState("");
  
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: formData.user_id,
        password: formData.password,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok && result.success) {
      window.location.href = result.redirect || "/accounts";
      return;
    }

    setError(result.error || "Unable to login");
  }

  return (
    <>
      <div className="login-form">
        <img src="/bank.png" alt="Logo" />
        <p>Sign In</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user_id">Username</label>
            <input type="text" id="user_id" placeholder="Username" value={formData.user_id} onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <div className="form-group">
            <button type="submit">Sign In</button>
          </div>
        </form>
      </div>

      {/* test links for navigation */}
      <a href="/accounts">Go to Account Page</a>
      <a href="/accounts/overview">Go to Account Overview</a>
    </>
  );
}
