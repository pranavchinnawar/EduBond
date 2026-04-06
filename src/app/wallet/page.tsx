"use client";

import { useApp } from "@/lib/store";

export default function WalletPage() {
  const { currentUser, isLoggedIn, transactions, exportCSV } = useApp();

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="auth-container animate-fade-in-up">
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🪙</div>
          <h2 className="heading-2">Sign In Required</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Sign in to view your wallet.</p>
          <a href="/auth/login"><button className="btn btn-primary">Sign In</button></a>
        </div>
      </div>
    );
  }

  const totalEarned = transactions.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const totalSpent = Math.abs(transactions.filter((t) => t.amount < 0).reduce((a, t) => a + t.amount, 0));
  const sessionCount = transactions.filter((t) => t.desc.startsWith("Teaching") || t.desc.startsWith("Learning")).length;

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <h1 className="heading-1">Token Wallet</h1>
        <p>Earn tokens by teaching. Spend them to learn. Your knowledge is your currency.</p>
      </div>

      {/* Balance Overview */}
      <div className="grid-stats" style={{ marginBottom: "2rem" }}>
        <div className="glass-panel stat-card">
          <div className="stat-value" style={{ color: "var(--accent-amber)" }}>🪙 {currentUser.tokenBalance}</div>
          <div className="stat-label">Current Balance</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-value" style={{ color: "var(--accent-green)" }}>+{totalEarned}</div>
          <div className="stat-label">Total Earned</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-value" style={{ color: "var(--accent-rose)" }}>-{totalSpent}</div>
          <div className="stat-label">Total Spent</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-value text-gradient-purple">{sessionCount}</div>
          <div className="stat-label">Sessions Completed</div>
        </div>
      </div>

      {/* How Tokens Work */}
      <section className="glass-panel" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
        <h3 className="heading-3" style={{ marginBottom: "1.25rem" }}>How Tokens Work</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          {[
            { emoji: "🎁", title: "Sign-Up Bonus", desc: "Get 50 free tokens when you verify your .edu email" },
            { emoji: "🎓", title: "Teach & Earn", desc: "Earn 10–20 tokens per teaching session based on duration" },
            { emoji: "📖", title: "Learn & Spend", desc: "Spend 10–20 tokens per learning session you book" },
            { emoji: "🏆", title: "Badge Rewards", desc: "Earn bonus tokens when you unlock achievement badges" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{item.emoji}</div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{item.title}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transaction Ledger */}
      <section className="glass-panel" style={{ padding: "2rem" }}>
        <div className="section-title">
          <h3 className="heading-3">Transaction History</h3>
          <button className="btn btn-ghost btn-sm" onClick={exportCSV}>Export CSV</button>
        </div>

        {transactions.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "1.5rem" }}>No transactions yet.</p>
        ) : (
          <div>
            {transactions.map((tx) => (
              <div key={tx.id} className="ledger-row">
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", minWidth: "50px" }}>{tx.date}</div>
                  <div style={{ fontSize: "0.9rem" }}>{tx.desc}</div>
                </div>
                <div className={tx.amount > 0 ? "ledger-amount-positive" : "ledger-amount-negative"}>
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} 🪙
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
