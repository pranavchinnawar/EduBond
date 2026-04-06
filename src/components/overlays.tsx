"use client";

import { useApp } from "@/lib/store";

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        zIndex: 1000,
        maxWidth: "400px",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-in"
          onClick={() => dismissToast(toast.id)}
          style={{
            padding: "1rem 1.25rem",
            borderRadius: "var(--radius-md)",
            background:
              toast.type === "success"
                ? "linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))"
                : toast.type === "error"
                ? "linear-gradient(135deg, rgba(244, 63, 94, 0.9), rgba(225, 29, 72, 0.9))"
                : "linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(124, 58, 237, 0.9))",
            color: "white",
            fontWeight: 500,
            fontSize: "0.9rem",
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            cursor: "pointer",
            lineHeight: 1.4,
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export function Modal() {
  const { showModal, modalData, showModalFn } = useApp();

  if (!showModal) return null;

  return (
    <div
      onClick={() => showModalFn(null)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 500,
        padding: "1rem",
      }}
    >
      <div
        className="glass-panel animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: "2rem", maxWidth: "500px", width: "100%" }}
      >
        {showModal === "addSkillTeach" && <AddSkillTeachModal />}
        {showModal === "addSkillLearn" && <AddSkillLearnModal />}
        {showModal === "editBio" && <EditBioModal />}
        {showModal === "scheduleSession" && <ScheduleSessionModal />}
        {showModal === "leaveReview" && <LeaveReviewModal sessionId={modalData.sessionId || ""} partnerName={modalData.partnerName || ""} />}
        {showModal === "confirmBan" && <ConfirmBanModal userId={modalData.userId || ""} userName={modalData.userName || ""} />}
        {showModal === "howItWorks" && <HowItWorksModal />}
        {showModal === "addPeer" && <AddPeerModal />}
        {showModal === "googleSignIn" && <GoogleSignInModal />}
      </div>
    </div>
  );
}

function AddSkillTeachModal() {
  const { addSkillToTeach, showModalFn } = useApp();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        addSkillToTeach(fd.get("skill") as string, fd.get("proficiency") as string);
        showModalFn(null);
      }}
    >
      <h3 className="heading-3" style={{ marginBottom: "1.25rem" }}>Add a Skill You Can Teach</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Skill Name</label>
          <input name="skill" className="input-field" placeholder="e.g. Python, Guitar, Spanish…" required />
        </div>
        <div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Proficiency Level</label>
          <select name="proficiency" className="input-field">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate" selected>Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => showModalFn(null)}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm">Add Skill</button>
        </div>
      </div>
    </form>
  );
}

function AddSkillLearnModal() {
  const { addSkillToLearn, showModalFn } = useApp();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        addSkillToLearn(fd.get("skill") as string);
        showModalFn(null);
      }}
    >
      <h3 className="heading-3" style={{ marginBottom: "1.25rem" }}>Request a Skill to Learn</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>What do you want to learn?</label>
          <input name="skill" className="input-field" placeholder="e.g. Machine Learning, Piano, French…" required />
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => showModalFn(null)}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm">Request Skill</button>
        </div>
      </div>
    </form>
  );
}

function EditBioModal() {
  const { currentUser, updateBio, showModalFn } = useApp();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        updateBio(fd.get("bio") as string);
        showModalFn(null);
      }}
    >
      <h3 className="heading-3" style={{ marginBottom: "1.25rem" }}>Edit Profile Bio</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <textarea
          name="bio"
          className="input-field"
          rows={4}
          defaultValue={currentUser?.bio || ""}
          style={{ resize: "vertical" }}
        />
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => showModalFn(null)}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
        </div>
      </div>
    </form>
  );
}

function ScheduleSessionModal() {
  const { scheduleSession, showModalFn, conversations } = useApp();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        scheduleSession({
          type: fd.get("type") as "teaching" | "learning",
          skill: fd.get("skill") as string,
          partnerName: fd.get("partner") as string,
          date: fd.get("date") as string,
          time: fd.get("time") as string,
          durationMin: parseInt(fd.get("duration") as string),
        });
        showModalFn(null);
      }}
    >
      <h3 className="heading-3" style={{ marginBottom: "1.25rem" }}>Schedule a New Session</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Type</label>
            <select name="type" className="input-field">
              <option value="teaching">Teaching</option>
              <option value="learning">Learning</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Duration</label>
            <select name="duration" className="input-field">
              <option value="30">30 min (10 🪙)</option>
              <option value="45">45 min (15 🪙)</option>
              <option value="60">60 min (15 🪙)</option>
              <option value="90">90 min (20 🪙)</option>
            </select>
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Skill</label>
          <input name="skill" className="input-field" placeholder="e.g. React Hooks" required />
        </div>
        <div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Partner</label>
          <select name="partner" className="input-field">
            {conversations.map((c) => (
              <option key={c.id} value={c.partnerName}>{c.partnerName}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Date</label>
            <input name="date" className="input-field" type="date" required />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Time</label>
            <input name="time" className="input-field" type="time" required />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => showModalFn(null)}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm">Schedule Session</button>
        </div>
      </div>
    </form>
  );
}

function LeaveReviewModal({ sessionId, partnerName }: { sessionId: string; partnerName: string }) {
  const { leaveReview, showModalFn } = useApp();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        leaveReview(sessionId, parseInt(fd.get("rating") as string), fd.get("comment") as string);
      }}
    >
      <h3 className="heading-3" style={{ marginBottom: "0.5rem" }}>Review {partnerName}</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>How was your session?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Rating</label>
          <select name="rating" className="input-field">
            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
            <option value="4">⭐⭐⭐⭐ Great</option>
            <option value="3">⭐⭐⭐ Good</option>
            <option value="2">⭐⭐ Fair</option>
            <option value="1">⭐ Poor</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Comment</label>
          <textarea name="comment" className="input-field" rows={3} placeholder="What went well? Any feedback?" style={{ resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => showModalFn(null)}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm">Submit Review</button>
        </div>
      </div>
    </form>
  );
}

function ConfirmBanModal({ userId, userName }: { userId: string; userName: string }) {
  const { banUser, showModalFn } = useApp();
  return (
    <div>
      <h3 className="heading-3" style={{ marginBottom: "0.5rem", color: "var(--accent-rose)" }}>⚠️ Ban User</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
        Are you sure you want to ban <strong style={{ color: "var(--text-primary)" }}>{userName}</strong>? This action will remove them from the platform.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button className="btn btn-secondary btn-sm" onClick={() => showModalFn(null)}>Cancel</button>
        <button
          className="btn btn-sm"
          style={{ background: "var(--accent-rose)", color: "white" }}
          onClick={() => { banUser(userId); showModalFn(null); }}
        >
          Confirm Ban
        </button>
      </div>
    </div>
  );
}

function HowItWorksModal() {
  const { showModalFn } = useApp();
  return (
    <div>
      <h3 className="heading-3" style={{ marginBottom: "1.25rem" }}>How SkillSwap Works</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {[
          { emoji: "1️⃣", title: "Create Your Profile", desc: "Sign up with your .edu email, list skills you can teach and want to learn." },
          { emoji: "2️⃣", title: "Get Matched", desc: "Our smart algorithm finds ideal learning partners based on mutual skill alignment." },
          { emoji: "3️⃣", title: "Schedule Sessions", desc: "Book sessions that work around your class schedule. Sync with your calendar." },
          { emoji: "4️⃣", title: "Swap & Earn", desc: "Teach to earn tokens, spend tokens to learn. Build your reputation with every session." },
          { emoji: "5️⃣", title: "Collect Badges", desc: "Unlock achievement badges as you grow. Showcase your expertise on your profile." },
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.25rem" }}>{step.emoji}</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: "0.15rem" }}>{step.title}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
        <button className="btn btn-primary btn-sm" onClick={() => showModalFn(null)}>Got It!</button>
      </div>
    </div>
  );
}

function AddPeerModal() {
  const { addPeer, showModalFn } = useApp();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const teaches = (fd.get("teaches") as string).split(",").map((s) => s.trim()).filter(Boolean);
        const learns = (fd.get("learns") as string).split(",").map((s) => s.trim()).filter(Boolean);
        addPeer({
          name: fd.get("name") as string,
          university: fd.get("university") as string,
          major: fd.get("major") as string,
          teaches,
          learns,
          tokenCost: parseInt(fd.get("tokenCost") as string) || 10,
        });
        showModalFn(null);
      }}
    >
      <h3 className="heading-3" style={{ marginBottom: "1.25rem" }}>Add a New User</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Full Name</label>
          <input name="name" className="input-field" placeholder="e.g. Sarah Jenkins" required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>University</label>
            <input name="university" className="input-field" placeholder="e.g. Stanford University" required />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Major</label>
            <input name="major" className="input-field" placeholder="e.g. Computer Science" required />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Skills They Can Teach (comma separated)</label>
          <input name="teaches" className="input-field" placeholder="e.g. React, TypeScript, Node.js" required />
        </div>
        <div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Skills They Want to Learn (comma separated, optional)</label>
          <input name="learns" className="input-field" placeholder="e.g. Figma, Spanish" />
        </div>
        <div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Token Cost Per Session</label>
          <select name="tokenCost" className="input-field">
            <option value="10">10 🪙</option>
            <option value="12">12 🪙</option>
            <option value="15">15 🪙</option>
            <option value="20">20 🪙</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => showModalFn(null)}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-sm">Add User</button>
        </div>
      </div>
    </form>
  );
}

function GoogleSignInModal() {
  const { googleLogin, showModalFn } = useApp();
  return (
    <div>
      {/* Google Logo */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span style={{ fontSize: "1.25rem", fontWeight: 700 }}>Sign in with Google</span>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>Enter your Google account details</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const name = fd.get("name") as string;
          const email = fd.get("email") as string;
          if (googleLogin(name, email)) {
            showModalFn(null);
            // Navigate after a tick to let state settle
            setTimeout(() => {
              window.location.href = "/";
            }, 100);
          }
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Full Name</label>
            <input name="name" className="input-field" placeholder="Your full name" required />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.35rem" }}>Google Email</label>
            <input name="email" className="input-field" type="email" placeholder="you@gmail.com" required />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.85rem 1.5rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "white",
              color: "#1f1f1f",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button type="button" className="btn btn-ghost btn-sm" onClick={() => showModalFn(null)} style={{ alignSelf: "center" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
