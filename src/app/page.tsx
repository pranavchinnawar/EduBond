"use client";

import { useApp } from "@/lib/store";
import Link from "next/link";

const CATEGORIES = ["All Skills", "Programming", "Design", "Languages", "Music", "Math & Science", "Business", "Same University"];

const SKILL_CATEGORIES: Record<string, string[]> = {
  Programming: ["React", "Next.js", "TypeScript", "Python", "Node.js", "Web Development", "Machine Learning", "Data Science"],
  Design: ["UI/UX", "Figma", "Branding"],
  Languages: ["Spanish", "French"],
  Music: ["Guitar", "Music Theory", "Songwriting"],
  "Math & Science": ["Calculus", "Linear Algebra"],
  Business: ["Financial Modeling", "Pitch Decks"],
};

export default function HomePage() {
  const { matches, searchQuery, activeFilter, setSearchQuery, setActiveFilter, connectMatch, isLoggedIn, showModalFn, currentUser, sessions, reviews } = useApp();

  const filtered = matches.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.teaches.some((s) => s.toLowerCase().includes(q)) ||
      m.learns.some((s) => s.toLowerCase().includes(q)) ||
      m.university.toLowerCase().includes(q);

    if (activeFilter === "All Skills") return matchesSearch;
    if (activeFilter === "Same University") return matchesSearch && m.university === currentUser?.university;

    const catSkills = SKILL_CATEGORIES[activeFilter];
    if (!catSkills) return matchesSearch;
    const hasSkill = [...m.teaches, ...m.learns].some((s) => catSkills.some((cs) => s.toLowerCase().includes(cs.toLowerCase())));
    return matchesSearch && hasSkill;
  });

  return (
    <div className="animate-fade-in-up">
      {/* Hero */}
      <section style={{ textAlign: "center", maxWidth: "720px", margin: "3rem auto 4rem" }}>
        <h1 className="heading-hero text-gradient-multi" style={{ marginBottom: "1.25rem" }}>
          Trade Knowledge.
          <br />
          Build Your Legacy.
        </h1>
        <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: "1.7", marginBottom: "2rem" }}>
          EduBond is the peer-to-peer exchange connecting college communities. Teach what you know, learn what you
          need—earn tokens for every session and build a reputation that opens doors.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {isLoggedIn ? (
            <button className="btn btn-primary btn-lg" onClick={() => document.getElementById("discover-section")?.scrollIntoView({ behavior: "smooth" })}>
              Find Partners
            </button>
          ) : (
            <Link href="/auth/register">
              <button className="btn btn-primary btn-lg">Get Started Free</button>
            </Link>
          )}
          <button className="btn btn-secondary btn-lg" onClick={() => showModalFn("howItWorks")}>
            How it Works
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid-stats" style={{ marginBottom: "3rem" }}>
        {[
          { value: String(matches.length), label: "Users on Platform", color: "" },
          { value: String(new Set([...matches.flatMap(m => [...m.teaches, ...m.learns])]).size), label: "Skills Available", color: "var(--accent-green)" },
          { value: String(sessions.filter(s => s.status === "completed").length), label: "Sessions Completed", color: "var(--accent-amber)" },
          { value: reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "—", label: "Avg. Rating", color: "var(--accent-cyan)" },
        ].map((stat, i) => (
          <div key={i} className="glass-panel stat-card animate-fade-in-up" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
            <div className={`stat-value ${!stat.color ? "text-gradient-purple" : ""}`} style={stat.color ? { color: stat.color } : {}}>
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Search */}
      <section style={{ marginBottom: "2rem" }} id="discover-section">
        <div className="glass-panel search-bar">
          <span style={{ fontSize: "1.2rem" }}>🔍</span>
          <input
            type="text"
            placeholder="Search skills, people, or universities…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="btn btn-ghost btn-sm" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>
        <div className="filter-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Matches */}
      <section>
        <div className="section-title">
          <h2 className="heading-2">
            {activeFilter === "All Skills" ? "Recommended Partners" : activeFilter}
            {searchQuery && <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 400 }}> — {filtered.length} results</span>}
          </h2>
          <button className="btn btn-primary btn-sm" onClick={() => showModalFn("addPeer")}>+ Add User</button>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👥</div>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>No users on the platform yet. Add your first one!</p>
            <button className="btn btn-primary" onClick={() => showModalFn("addPeer")}>+ Add User</button>
          </div>
        ) : (
          <div className="grid-cards stagger-children">
            {filtered.map((m) => (
              <div key={m.userId} className="glass-panel glass-panel-interactive match-card animate-fade-in-up">
                <div className="match-card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div className="match-card-avatar" style={{ background: m.avatarGradient }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{m.name}</div>
                      <div className="match-card-meta">{m.major} • {m.university}</div>
                    </div>
                  </div>
                  <div className="match-card-score">★ {m.rating}</div>
                </div>

                <div style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  {m.matchType === "direct_swap" ? (
                    <span style={{ padding: "0.2rem 0.6rem", background: "rgba(16,185,129,0.15)", borderRadius: "var(--radius-full)", fontSize: "0.75rem", color: "var(--accent-green)", fontWeight: 600 }}>
                      ⚡ Direct Swap
                    </span>
                  ) : (
                    <span style={{ padding: "0.2rem 0.6rem", background: "rgba(139,92,246,0.15)", borderRadius: "var(--radius-full)", fontSize: "0.75rem", color: "#c4b5fd", fontWeight: 600 }}>
                      📚 One-Way Match
                    </span>
                  )}
                  <span className="token-badge" style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}>
                    🪙 {m.tokenCost} / session
                  </span>
                </div>

                <div className="match-card-skills">
                  <div>
                    <div className="match-card-skill-label match-card-skill-label-teach">Can Teach</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {m.teaches.map((s) => (
                        <span key={s} className="skill-tag skill-tag-teach">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="match-card-skill-label match-card-skill-label-learn">Wants to Learn</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {m.learns.map((s) => (
                        <span key={s} className="skill-tag skill-tag-learn">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {m.connected ? (
                  <Link href="/messages">
                    <button className="btn btn-accent-green" style={{ width: "100%", marginTop: "0.5rem" }}>
                      ✓ Connected — Go to Messages
                    </button>
                  </Link>
                ) : (
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "0.5rem" }}
                    onClick={() => connectMatch(m.userId)}
                  >
                    Connect & Swap
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
