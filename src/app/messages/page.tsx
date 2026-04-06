"use client";

import { useApp } from "@/lib/store";
import { useState, useRef, useEffect } from "react";

export default function MessagesPage() {
  const { conversations, activeConversation, setActiveConversation, sendMessage, isLoggedIn, showModalFn } = useApp();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversation);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length]);

  if (!isLoggedIn) {
    return (
      <div className="auth-container animate-fade-in-up">
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
          <h2 className="heading-2">Sign In to Chat</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Connect with learning partners.</p>
          <a href="/auth/login"><button className="btn btn-primary">Sign In</button></a>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim() || !activeConv) return;
    sendMessage(activeConv.id, input);
    setInput("");
  };

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <h1 className="heading-1">Messages</h1>
        <p>Communicate with your learning partners before sessions.</p>
      </div>

      <div
        className="glass-panel"
        style={{
          display: "grid",
          gridTemplateColumns: conversations.length > 0 ? "280px 1fr" : "1fr",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          minHeight: "500px",
        }}
      >
        {/* Conversation List */}
        <div style={{ borderRight: "1px solid var(--glass-border)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "1rem", borderBottom: "1px solid var(--glass-border)" }}>
            <input className="input-field" placeholder="Search conversations…" style={{ fontSize: "0.85rem" }} />
          </div>

          {conversations.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
              <p>No conversations yet.</p>
              <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Connect with someone on the <a href="/" style={{ color: "var(--accent-purple)" }}>Discover</a> page!</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isActive = conv.id === activeConversation;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    padding: "1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    cursor: "pointer",
                    background: isActive ? "rgba(139, 92, 246, 0.08)" : "transparent",
                    transition: "background 0.15s ease",
                  }}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: conv.partnerGradient, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{conv.partnerName}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{lastMsg?.time}</div>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {lastMsg?.senderId === "user-self" ? "You: " : ""}{lastMsg?.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Active Chat */}
        {activeConv ? (
          <div className="chat-container">
            {/* Header */}
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: activeConv.partnerGradient }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{activeConv.partnerName}</div>
                  <div style={{ fontSize: "0.75rem", color: activeConv.online ? "var(--accent-green)" : "var(--text-muted)" }}>
                    {activeConv.online ? "● Online" : "● Offline"}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => showModalFn("scheduleSession")}>📅 Schedule</button>
                <button className="btn btn-primary btn-sm" onClick={() => window.open("https://meet.google.com", "_blank")}>Start Call</button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {activeConv.messages.map((msg) => (
                <div key={msg.id}>
                  <div className={`chat-bubble ${msg.senderId === "user-self" ? "chat-bubble-sent" : "chat-bubble-received"}`}>
                    {msg.content}
                  </div>
                  <div className="chat-time" style={{ textAlign: msg.senderId === "user-self" ? "right" : "left" }}>
                    {msg.time}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-bar">
              <input
                className="input-field"
                placeholder="Type a message…"
                style={{ flex: 1 }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              />
              <button className="btn btn-primary btn-sm" onClick={handleSend} disabled={!input.trim()}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
