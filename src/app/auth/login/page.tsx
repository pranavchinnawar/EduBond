"use client";

import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { login, isLoggedIn, showModalFn } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (isLoggedIn) {
    return (
      <div className="auth-container animate-fade-in-up">
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
          <h2 className="heading-2">You&apos;re Signed In</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>You&apos;re already logged in.</p>
          <button className="btn btn-primary" onClick={() => router.push("/")}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      router.push("/");
    }
  };

  return (
    <div className="auth-container animate-fade-in-up">
      <div className="glass-panel auth-card">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="navbar-logo text-gradient-purple" style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
            SkillSwap
          </div>
          <h1 className="heading-2">Welcome Back</h1>
          <p style={{ margin: 0 }}>Sign in with your college email to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label>College Email</label>
            <input
              className="input-field"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
            Sign In
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
            Sign in with Google
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Don&apos;t have an account?{" "}
          <a href="/auth/register" style={{ color: "var(--accent-purple)", fontWeight: 600 }}>
            Sign Up Free
          </a>
        </p>
      </div>
    </div>
  );
}
