"use client";

import { useApp } from "@/lib/store";
import { useState } from "react";

export default function AdminPage() {
  const { currentUser, isLoggedIn, showModalFn, matches, sessions, transactions, reviews, addToast, banUser } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isLoggedIn || currentUser?.role !== "admin") {
    return (
      <div className="auth-container animate-fade-in-up">
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛡️</div>
          <h2 className="heading-2">Admin Access Only</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>You need admin privileges to access this page.</p>
          <a href="/"><button className="btn btn-primary">Go Home</button></a>
        </div>
      </div>
    );
  }

  const filteredUsers = matches.filter((u) =>
    !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTokensEarned = transactions.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const totalTokensSpent = Math.abs(transactions.filter(t => t.amount < 0).reduce((a, t) => a + t.amount, 0));
  const allSkills = [...new Set(matches.flatMap(m => [...m.teaches, ...m.learns]))];

  // Build skill analytics from actual data
  const skillAnalytics = allSkills.map(skill => {
    const teachCount = matches.filter(m => m.teaches.some(s => s.toLowerCase().includes(skill.toLowerCase()))).length;
    const learnCount = matches.filter(m => m.learns.some(s => s.toLowerCase().includes(skill.toLowerCase()))).length;
    return { name: skill, demand: learnCount, supply: teachCount };
  }).sort((a, b) => (b.demand + b.supply) - (a.demand + a.supply)).slice(0, 8);

  const maxDemand = Math.max(...skillAnalytics.map(s => s.demand + s.supply), 1);

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <h1 className="heading-1">Admin Dashboard</h1>
        <p>Monitor platform health, moderate content, and analyze user analytics.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid-stats" style={{ marginBottom: "2rem" }}>
        <div className="glass-panel admin-metric">
          <div className="admin-metric-value text-gradient-purple">{matches.length}</div>
          <div className="admin-metric-label">Total Users</div>
        </div>
        <div className="glass-panel admin-metric">
          <div className="admin-metric-value" style={{ color: "var(--accent-green)" }}>{matches.filter(m => m.connected).length}</div>
          <div className="admin-metric-label">Connected Users</div>
        </div>
        <div className="glass-panel admin-metric">
          <div className="admin-metric-value" style={{ color: "var(--accent-amber)" }}>{sessions.length}</div>
          <div className="admin-metric-label">Total Sessions</div>
        </div>
        <div className="glass-panel admin-metric">
          <div className="admin-metric-value" style={{ color: "var(--accent-cyan)" }}>{allSkills.length}</div>
          <div className="admin-metric-label">Skills Listed</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
        {/* Economy + Moderation */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 className="heading-3" style={{ marginBottom: "1rem" }}>Token Economy</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "Your Balance", value: `🪙 ${currentUser?.tokenBalance || 0}`, color: "var(--accent-amber)" },
                { label: "Total Earned", value: `+${totalTokensEarned}`, color: "var(--accent-green)" },
                { label: "Total Spent", value: `-${totalTokensSpent}`, color: "var(--accent-rose)" },
                { label: "Transactions", value: String(transactions.length), color: undefined },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 className="heading-3" style={{ marginBottom: "1rem" }}>Platform Overview</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem" }}>Reviews Submitted</span>
                <span style={{ padding: "0.2rem 0.6rem", background: "rgba(139,92,246,0.15)", color: "#c4b5fd", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 600 }}>{reviews.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem" }}>Completed Sessions</span>
                <span style={{ padding: "0.2rem 0.6rem", background: "rgba(16,185,129,0.15)", color: "var(--accent-green)", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 600 }}>{sessions.filter(s => s.status === "completed").length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem" }}>Cancelled Sessions</span>
                <span style={{ padding: "0.2rem 0.6rem", background: "rgba(244,63,94,0.15)", color: "var(--accent-rose)", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 600 }}>{sessions.filter(s => s.status === "cancelled").length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <section className="glass-panel" style={{ padding: "2rem", overflowX: "auto" }}>
          <div className="section-title">
            <h3 className="heading-3">User Management</h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                className="input-field"
                placeholder="Search users…"
                style={{ width: "200px", fontSize: "0.85rem" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary btn-sm" onClick={() => showModalFn("addPeer")}>+ Add User</button>
            </div>
          </div>
          {matches.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>No users on the platform yet.</p>
              <button className="btn btn-primary btn-sm" onClick={() => showModalFn("addPeer")}>+ Add First User</button>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>University</th>
                  <th>Type</th>
                  <th>Cost</th>
                  <th>Rating</th>
                  <th>Teaches</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.userId}>
                    <td style={{ fontWeight: 600 }}>{user.name}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{user.university}</td>
                    <td>
                      <span style={{ padding: "0.15rem 0.5rem", borderRadius: "var(--radius-full)", fontSize: "0.7rem", fontWeight: 600, background: user.matchType === "direct_swap" ? "rgba(16,185,129,0.15)" : "rgba(139,92,246,0.15)", color: user.matchType === "direct_swap" ? "var(--accent-green)" : "#c4b5fd" }}>
                        {user.matchType === "direct_swap" ? "Swap" : "One-Way"}
                      </span>
                    </td>
                    <td style={{ color: "var(--accent-amber)", fontWeight: 600 }}>🪙 {user.tokenCost}</td>
                    <td>★ {user.rating}</td>
                    <td style={{ fontSize: "0.85rem" }}>{user.teaches.slice(0, 2).join(", ")}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }} onClick={() => addToast(`Viewing ${user.name}'s profile…`, "info")}>View</button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", color: "var(--accent-rose)" }} onClick={() => showModalFn("confirmBan", { userId: user.userId, userName: user.name })}>Ban</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Skills Analytics */}
        <section className="glass-panel" style={{ padding: "2rem" }}>
          <h3 className="heading-3" style={{ marginBottom: "1.25rem" }}>Skill Analytics</h3>
          {skillAnalytics.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>Add users to see skill analytics.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {skillAnalytics.map((skill, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ minWidth: "130px", fontWeight: 500, fontSize: "0.9rem" }}>{skill.name}</div>
                  <div style={{ flex: 1, display: "flex", gap: "0.25rem", alignItems: "center" }}>
                    <div style={{ flex: 1, height: "8px", background: "var(--bg-elevated)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${((skill.demand + skill.supply) / maxDemand) * 100}%`, background: "linear-gradient(90deg, var(--accent-green), var(--accent-cyan))", borderRadius: "4px", transition: "width 1s ease" }} />
                    </div>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", minWidth: "80px" }}>{skill.supply} teach · {skill.demand} learn</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
