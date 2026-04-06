"use client";

import { useApp } from "@/lib/store";
import Link from "next/link";

export default function ProfilePage() {
  const { currentUser, isLoggedIn, reviews, sessions, showModalFn, removeSkillToTeach, removeSkillToLearn } = useApp();

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="auth-container animate-fade-in-up">
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
          <h2 className="heading-2" style={{ marginBottom: "0.5rem" }}>Sign In Required</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Please sign in to view your profile.</p>
          <Link href="/auth/login"><button className="btn btn-primary">Sign In</button></Link>
        </div>
      </div>
    );
  }

  const upcomingSessions = sessions.filter((s) => s.status === "upcoming").slice(0, 3);
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / totalReviews).toFixed(1) : "0.0";

  return (
    <div className="animate-fade-in-up">
      <div className="profile-layout">
        {/* Main Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Header */}
          <section className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: currentUser.avatarGradient, boxShadow: "0 0 30px var(--accent-purple-glow)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <h1 className="heading-2" style={{ marginBottom: 0 }}>{currentUser.name}</h1>
                  {currentUser.emailVerified && (
                    <span style={{ padding: "0.2rem 0.6rem", background: "rgba(16,185,129,0.15)", borderRadius: "var(--radius-full)", fontSize: "0.75rem", color: "var(--accent-green)", fontWeight: 600 }}>
                      ✓ Verified .edu
                    </span>
                  )}
                </div>
                <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  {currentUser.major} • {currentUser.university} • {currentUser.year}
                </p>
                <p style={{ marginTop: "0.75rem", lineHeight: 1.6, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  {currentUser.bio}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button className="btn btn-primary btn-sm" onClick={() => showModalFn("editBio")}>Edit Profile</button>
              <button className="btn btn-secondary btn-sm" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                // addToast handled via store
              }}>Share Profile</button>
            </div>
          </section>

          {/* Skills */}
          <section className="glass-panel" style={{ padding: "2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
              <div>
                <h3 className="heading-3" style={{ color: "var(--accent-purple)", marginBottom: "1rem" }}>Skills I Offer</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {currentUser.skillsToTeach.map((s) => (
                    <span key={s.id} className="skill-tag skill-tag-teach" style={{ cursor: "pointer" }} onClick={() => removeSkillToTeach(s.id)} title="Click to remove">
                      {s.skill} ({s.proficiency}) ×
                    </span>
                  ))}
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ border: "1px dashed var(--glass-border)", borderRadius: "var(--radius-full)" }}
                    onClick={() => showModalFn("addSkillTeach")}
                  >
                    + Add Skill
                  </button>
                </div>
              </div>
              <div>
                <h3 className="heading-3" style={{ color: "var(--accent-green)", marginBottom: "1rem" }}>Skills I Need</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {currentUser.skillsToLearn.map((s) => (
                    <span key={s.id} className="skill-tag skill-tag-learn" style={{ cursor: "pointer" }} onClick={() => removeSkillToLearn(s.id)} title="Click to remove">
                      {s.skill} ×
                    </span>
                  ))}
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ border: "1px dashed var(--glass-border)", borderRadius: "var(--radius-full)" }}
                    onClick={() => showModalFn("addSkillLearn")}
                  >
                    + Request Skill
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming Sessions */}
          <section className="glass-panel" style={{ padding: "2rem" }}>
            <div className="section-title">
              <h3 className="heading-3">Upcoming Sessions</h3>
              <Link href="/schedule"><button className="btn btn-ghost btn-sm">View All →</button></Link>
            </div>
            {upcomingSessions.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "1rem" }}>No upcoming sessions. <Link href="/" style={{ color: "var(--accent-purple)" }}>Find a partner!</Link></p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {upcomingSessions.map((s) => (
                  <div key={s.id} className="session-row">
                    <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                      <div className="session-date">
                        <div className="session-date-day">{s.date}</div>
                        <div className="session-date-time">{s.time}</div>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{s.type === "teaching" ? "Teaching" : "Learning"}: {s.skill}</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>with {s.partnerName} • {s.durationMin} min</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <span className="token-badge">🪙 {s.tokens > 0 ? `+${s.tokens}` : s.tokens}</span>
                      <button className="btn btn-primary btn-sm" onClick={() => showModalFn("scheduleSession")}>Join</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Reviews */}
          <section className="glass-panel" style={{ padding: "2rem" }}>
            <div className="section-title">
              <h3 className="heading-3">Reviews</h3>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{totalReviews} total</span>
            </div>
            {reviews.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "1rem" }}>No reviews yet. Complete a session to get reviewed!</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {reviews.map((r) => (
                  <div key={r.id} style={{ padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div style={{ fontWeight: 600 }}>{r.reviewerName}</div>
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`star ${s <= r.rating ? "filled" : ""}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                      &ldquo;{r.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Reputation */}
          <div className="glass-panel stat-card">
            <div className="stat-value" style={{ color: "var(--accent-amber)" }}>{avgRating}</div>
            <div className="stars" style={{ justifyContent: "center", marginBottom: "0.5rem" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`star ${s <= Math.round(parseFloat(avgRating)) ? "filled" : ""}`}>★</span>
              ))}
            </div>
            <div className="stat-label">{totalReviews} Reviews</div>
          </div>

          {/* Token Balance */}
          <div className="glass-panel" style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>Token Balance</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent-amber)" }}>🪙 {currentUser.tokenBalance}</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Earn by teaching • Spend to learn</p>
            <Link href="/wallet">
              <button className="btn btn-secondary btn-sm" style={{ marginTop: "1rem", width: "100%" }}>View Wallet →</button>
            </Link>
          </div>

          {/* Badges */}
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 className="heading-3" style={{ marginBottom: "1rem" }}>Badge Portfolio</h3>
            <div className="grid-badges">
              {currentUser.badges.map((b) => (
                <div key={b.id} className={`badge-item ${b.earned ? "badge-item-earned" : "badge-item-locked"}`}>
                  <span className="badge-emoji">{b.earned ? b.emoji : "🔒"}</span>
                  <div className="badge-name">{b.name}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
