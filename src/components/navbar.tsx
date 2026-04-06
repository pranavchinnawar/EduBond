"use client";

import { useApp } from "@/lib/store";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const { currentUser, isLoggedIn, logout } = useApp();
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Discover" },
    { href: "/profile", label: "Profile" },
    { href: "/messages", label: "Messages" },
    { href: "/schedule", label: "Schedule" },
    { href: "/wallet", label: "Wallet" },
  ];

  if (currentUser?.role === "admin") {
    links.push({ href: "/admin", label: "Admin" });
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner glass-panel">
        <Link href="/" className="navbar-logo text-gradient-purple">
          SkillSwap
        </Link>

        <div className="navbar-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {isLoggedIn && currentUser ? (
            <>
              <Link href="/wallet">
                <div className="token-badge" style={{ cursor: "pointer" }}>
                  🪙 {currentUser.tokenBalance}
                </div>
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={logout}>
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth/login">
              <button className="btn btn-primary btn-sm">Sign In</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
