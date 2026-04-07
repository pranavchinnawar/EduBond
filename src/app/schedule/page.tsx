"use client";

import { useApp } from "@/lib/store";

export default function SchedulePage() {
  const { sessions, isLoggedIn, showModalFn, cancelSession, completeSession, syncCalendar } = useApp();

  if (!isLoggedIn) {
    return (
      <div className="auth-container animate-fade-in-up">
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📅</div>
          <h2 className="heading-2">Sign In Required</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Sign in to manage your schedule.</p>
          <a href="/auth/login"><button className="btn btn-primary">Sign In</button></a>
        </div>
      </div>
    );
  }

  const upcoming = sessions.filter((s) => s.status === "upcoming");
  const completed = sessions.filter((s) => s.status === "completed");
  const cancelled = sessions.filter((s) => s.status === "cancelled");

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 className="heading-1">Schedule</h1>
            <p>Manage sessions around your class schedule. Export to your favorite calendar app.</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-secondary btn-sm" onClick={syncCalendar}>📅 Sync Calendar</button>
            <button className="btn btn-secondary btn-sm" onClick={syncCalendar}>🍎 Export .ics</button>
          </div>
        </div>
      </div>

      {/* Weekly Calendar Header */}
      <section className="glass-panel" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <button className="btn btn-ghost btn-sm">← Previous</button>
          <h3 className="heading-3">April 6 – April 12, 2026</h3>
          <button className="btn btn-ghost btn-sm">Next →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem", textAlign: "center" }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
            const dayNum = 6 + i;
            const hasSessions = upcoming.some((s) => s.date.includes(String(dayNum)));
            return (
              <div key={day}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>{day}</div>
                <div style={{ padding: "0.5rem", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: "0.95rem", background: i === 0 ? "linear-gradient(135deg, var(--accent-purple), var(--accent-purple-hover))" : hasSessions ? "rgba(139,92,246,0.15)" : "transparent", color: i === 0 ? "white" : "inherit" }}>
                  {dayNum}
                </div>
                {hasSessions && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-green)", margin: "0.25rem auto 0" }} />}
              </div>
            );
          })}
        </div>
      </section>

      {/* Upcoming Sessions */}
      <section className="glass-panel" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
        <div className="section-title">
          <h3 className="heading-3">Upcoming Sessions ({upcoming.length})</h3>
          <button className="btn btn-primary btn-sm" onClick={() => showModalFn("scheduleSession")}>+ New Session</button>
        </div>

        {upcoming.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "1.5rem" }}>No upcoming sessions. Schedule one above!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {upcoming.map((s) => (
              <div key={s.id} className="session-row">
                <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                  <div className="session-date">
                    <div className="session-date-day">{s.date}</div>
                    <div className="session-date-time">{s.time}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: "0.15rem" }}>
                      {s.type === "teaching" ? "Teaching" : "Learning"}: {s.skill}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      with {s.partnerName} • {s.durationMin} min
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span className="token-badge">🪙 {s.tokens > 0 ? `+${s.tokens}` : s.tokens}</span>
                  <button className="btn btn-primary btn-sm" onClick={() => completeSession(s.id)}>Complete</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => cancelSession(s.id)}>Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Completed Sessions */}
      {completed.length > 0 && (
        <section className="glass-panel" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
          <h3 className="heading-3" style={{ marginBottom: "1rem" }}>Completed ({completed.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {completed.map((s) => (
              <div key={s.id} className="session-row" style={{ opacity: 0.7 }}>
                <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                  <div className="session-date">
                    <div className="session-date-day">{s.date}</div>
                    <div className="session-date-time">{s.time}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      <s>{s.type === "teaching" ? "Teaching" : "Learning"}: {s.skill}</s>{" "}
                      <span style={{ color: "var(--accent-green)", fontSize: "0.8rem" }}>✓ Done</span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>with {s.partnerName}</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => showModalFn("leaveReview", { sessionId: s.id, partnerName: s.partnerName })}>
                  Leave Review
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cancelled */}
      {cancelled.length > 0 && (
        <section className="glass-panel" style={{ padding: "2rem" }}>
          <h3 className="heading-3" style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>Cancelled ({cancelled.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {cancelled.map((s) => (
              <div key={s.id} style={{ padding: "0.75rem 1rem", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-md)", opacity: 0.5, fontSize: "0.9rem" }}>
                <s>{s.type === "teaching" ? "Teaching" : "Learning"}: {s.skill} with {s.partnerName}</s>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Smart Tip */}
      <section className="glass-panel" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span style={{ fontSize: "1.5rem" }}>💡</span>
          <div>
            <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Smart Scheduling Tip</div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Sync your class calendar to automatically block busy times. EduBond will only suggest available time
              slots to your learning partners, preventing scheduling conflicts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
