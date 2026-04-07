"use client";

import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const { register, isLoggedIn, showModalFn } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    university: "",
    major: "",
    year: "",
    password: "",
  });

  if (isLoggedIn) {
    return (
      <div className="auth-container animate-fade-in-up">
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
          <h2 className="heading-2">You&apos;re Signed In</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>You already have an account.</p>
          <button className="btn btn-primary" onClick={() => router.push("/profile")}>Go to Profile</button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (register(form)) {
      router.push("/profile");
    }
  };

  return (
    <div className="auth-container animate-fade-in-up">
      <div className="glass-panel auth-card" style={{ maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="navbar-logo text-gradient-purple" style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
            EduBond
          </div>
          <h1 className="heading-2">Create Your Account</h1>
          <p style={{ margin: 0 }}>
            Use your <strong>.edu</strong> email to join your college community
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label>Full Name</label>
            <input name="name" className="input-field" type="text" placeholder="Jane Doe" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label>College Email (.edu required)</label>
            <input name="email" className="input-field" type="email" placeholder="jdoe@stanford.edu" value={form.email} onChange={handleChange} required />
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.35rem", fontSize: "0.75rem", color: form.email.endsWith(".edu") ? "var(--accent-green)" : "var(--text-muted)" }}>
              <span>{form.email.endsWith(".edu") ? "✅" : "🔒"}</span>
              {form.email.endsWith(".edu") ? "Valid .edu email detected!" : "We'll send a verification link to confirm your email"}
            </div>
          </div>
          <div>
            <label>University</label>
            <input name="university" className="input-field" type="text" placeholder="Stanford University" value={form.university} onChange={handleChange} required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label>Major</label>
              <input name="major" className="input-field" type="text" placeholder="Computer Science" value={form.major} onChange={handleChange} />
            </div>
            <div>
              <label>Year</label>
              <select name="year" className="input-field" value={form.year} onChange={handleChange}>
                <option value="">Select…</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>
          <div>
            <label>Password</label>
            <input name="password" className="input-field" type="password" placeholder="Min 8 characters" value={form.password} onChange={handleChange} required />
            {form.password.length > 0 && form.password.length < 8 && (
              <div style={{ fontSize: "0.75rem", color: "var(--accent-rose)", marginTop: "0.35rem" }}>
                Password must be at least 8 characters
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
            Create Account & Verify Email
          </button>

          <div className="auth-divider">or</div>

          <button
            type="button"
            onClick={() => showModalFn("googleSignIn")}
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
            Sign up with Google
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <a href="/auth/login" style={{ color: "var(--accent-purple)", fontWeight: 600 }}>Sign In</a>
        </p>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
          By signing up, you agree to our Terms of Service and Privacy Policy. Your .edu email will be verified to
          ensure community safety.
        </p>
      </div>
    </div>
  );
}
