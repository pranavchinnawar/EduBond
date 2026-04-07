"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { loginUser, registerUser, getUserData } from "./actions";

// ==================== TYPES ====================

export interface User {
  id: string;
  name: string;
  university: string;
  email: string;
  emailVerified: boolean;
  bio: string;
  major: string;
  year: string;
  reputationScore: number;
  tokenBalance: number;
  role: "student" | "admin";
  avatarGradient: string;
  skillsToTeach: SkillEntry[];
  skillsToLearn: SkillEntry[];
  badges: Badge[];
}

export interface SkillEntry {
  id: string;
  skill: string;
  proficiency?: string;
}

export interface Badge {
  id: string;
  emoji: string;
  name: string;
  earned: boolean;
}

export interface MatchCard {
  userId: string;
  name: string;
  university: string;
  major: string;
  rating: number;
  avatarGradient: string;
  matchType: "direct_swap" | "one_way";
  tokenCost: number;
  teaches: string[];
  learns: string[];
  connected: boolean;
}

export interface Conversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerGradient: string;
  online: boolean;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  time: string;
}

export interface Session {
  id: string;
  type: "teaching" | "learning";
  skill: string;
  partnerName: string;
  date: string;
  time: string;
  durationMin: number;
  tokens: number;
  status: "upcoming" | "completed" | "cancelled";
}

export interface TokenTransaction {
  id: string;
  date: string;
  desc: string;
  amount: number;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

// ==================== INITIAL DATA ====================
// All user data starts empty. Content is created via user actions.

const DEFAULT_BADGES: Badge[] = [
  { id: "b1", emoji: "🌟", name: "Top Teacher", earned: false },
  { id: "b2", emoji: "🔥", name: "5-Week Streak", earned: false },
  { id: "b3", emoji: "💬", name: "10 Sessions", earned: false },
  { id: "b4", emoji: "🧠", name: "Polymath", earned: false },
  { id: "b5", emoji: "💯", name: "Centurion", earned: false },
  { id: "b6", emoji: "👑", name: "Mentor Elite", earned: false },
];

// No pre-populated users. All peers are added via the Add User button.

// ==================== CONTEXT ====================

interface AppState {
  currentUser: User | null;
  isLoggedIn: boolean;
  matches: MatchCard[];
  conversations: Conversation[];
  sessions: Session[];
  transactions: TokenTransaction[];
  reviews: Review[];
  toasts: Toast[];
  searchQuery: string;
  activeFilter: string;
  activeConversation: string | null;
  showModal: string | null;
  modalData: Record<string, string>;
}

interface AppContextType extends AppState {
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: { name: string; email: string; university: string; major: string; year: string; password?: string }) => Promise<boolean>;
  logout: () => void;
  connectMatch: (userId: string) => void;
  sendMessage: (convId: string, content: string) => void;
  setSearchQuery: (q: string) => void;
  setActiveFilter: (f: string) => void;
  setActiveConversation: (id: string | null) => void;
  addSkillToTeach: (skill: string, proficiency: string) => void;
  addSkillToLearn: (skill: string) => void;
  removeSkillToTeach: (id: string) => void;
  removeSkillToLearn: (id: string) => void;
  updateBio: (bio: string) => void;
  scheduleSession: (data: { type: "teaching" | "learning"; skill: string; partnerName: string; date: string; time: string; durationMin: number }) => void;
  cancelSession: (id: string) => void;
  completeSession: (id: string) => void;
  leaveReview: (sessionId: string, rating: number, comment: string) => void;
  showModalFn: (modal: string | null, data?: Record<string, string>) => void;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  dismissToast: (id: string) => void;
  banUser: (userId: string) => void;
  exportCSV: () => void;
  syncCalendar: () => void;
  addPeer: (data: { name: string; university: string; major: string; teaches: string[]; learns: string[]; tokenCost: number }) => void;
  googleLogin: (name: string, email: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// ==================== PROVIDER ====================

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    isLoggedIn: false,
    matches: [],
    conversations: [],
    sessions: [],
    transactions: [],
    reviews: [],
    toasts: [],
    searchQuery: "",
    activeFilter: "All Skills",
    activeConversation: null,
    showModal: null,
    modalData: {},
  });

  useEffect(() => {
    const userId = localStorage.getItem("edubond_user_id");
    if (userId) {
      getUserData(userId).then(data => {
        if (data && data.user) {
          setState(s => ({
            ...s,
            isLoggedIn: true,
            currentUser: data.user as User,
            transactions: data.transactions as TokenTransaction[],
            sessions: data.rawSessions as any,
          }));
        } else {
           localStorage.removeItem("edubond_user_id");
        }
      });
    }
  }, []);

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = `toast-${Date.now()}`;
    setState((s) => ({ ...s, toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      setState((s) => ({ ...s, toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setState((s) => ({ ...s, toasts: s.toasts.filter((t) => t.id !== id) }));
  }, []);  const login = useCallback(async (email: string, password?: string) => {
    if (!email.endsWith(".edu")) {
      addToast("Please use a valid .edu email address", "error");
      return false;
    }
    const res = await loginUser(email, password);
    if (!res.success || !res.user) {
      addToast(res.message || "User not found or invalid password", "error");
      return false;
    }

    localStorage.setItem("edubond_user_id", res.user.id);
    
    // Fetch remaining data
    const extraData = await getUserData(res.user.id);

    setState((s) => ({
      ...s,
      isLoggedIn: true,
      currentUser: res.user as User,
      transactions: extraData ? (extraData.transactions as TokenTransaction[]) : s.transactions,
      sessions: extraData ? (extraData.rawSessions as any) : s.sessions,
    }));

    addToast(`Welcome back, ${res.user.name}! 🎉`);
    return true;
  }, [addToast]);

  const register = useCallback(async (data: any) => {
    if (!data.email.endsWith(".edu")) {
      addToast("Only .edu email addresses are allowed", "error");
      return false;
    }
    if (!data.name || !data.university || !data.password) {
      addToast("Please fill in all required fields", "error");
      return false;
    }
    if (data.password.length < 8) {
      addToast("Password must be at least 8 characters", "error");
      return false;
    }
    const res = await registerUser(data);
    if (!res.success || !res.user) {
      addToast(res.message || "Registration failed", "error");
      return false;
    }

    localStorage.setItem("edubond_user_id", res.user.id);

    setState((s) => ({ 
      ...s, 
      isLoggedIn: true, 
      currentUser: res.user as User, 
      transactions: [{ id: `t-${Date.now()}`, date: "Today", desc: "Sign-Up Bonus", amount: 50 }, ...s.transactions] 
    }));
    
    addToast(`Account created! 🎉`);
    return true;
  }, [addToast]);

  const logout = useCallback(() => {
    localStorage.removeItem("edubond_user_id");
    setState((s) => ({ ...s, isLoggedIn: false, currentUser: null, transactions: [], sessions: [] }));
    addToast("You have been logged out", "info");
  }, [addToast]);

  const connectMatch = useCallback((userId: string) => {
    setState((s) => {
      const match = s.matches.find((m) => m.userId === userId);
      if (!match || match.connected) return s;
      if (s.currentUser && s.currentUser.tokenBalance < match.tokenCost) {
        addToast("Not enough tokens! Earn more by teaching.", "error");
        return s;
      }
      const existing = s.conversations.find((c) => c.partnerId === userId);
      const newConv: Conversation | null = existing ? null : {
        id: `conv-${Date.now()}`,
        partnerId: userId,
        partnerName: match.name,
        partnerGradient: match.avatarGradient,
        online: Math.random() > 0.5,
        messages: [],
      };
      return {
        ...s,
        matches: s.matches.map((m) => (m.userId === userId ? { ...m, connected: true } : m)),
        conversations: newConv ? [newConv, ...s.conversations] : s.conversations,
        activeConversation: newConv ? newConv.id : existing?.id || s.activeConversation,
      };
    });
    addToast("Connection request sent! 🤝 Check your messages.");
  }, [addToast]);

  const sendMessage = useCallback((convId: string, content: string) => {
    if (!content.trim()) return;
    const msg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: "user-self",
      content: content.trim(),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    setState((s) => ({
      ...s,
      conversations: s.conversations.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, msg] } : c)),
    }));
  }, []);

  const setSearchQuery = useCallback((q: string) => {
    setState((s) => ({ ...s, searchQuery: q }));
  }, []);

  const setActiveFilter = useCallback((f: string) => {
    setState((s) => ({ ...s, activeFilter: f }));
  }, []);

  const setActiveConversation = useCallback((id: string | null) => {
    setState((s) => ({ ...s, activeConversation: id }));
  }, []);

  const addSkillToTeach = useCallback((skill: string, proficiency: string) => {
    if (!skill.trim()) return;
    setState((s) => {
      if (!s.currentUser) return s;
      const entry: SkillEntry = { id: `st-${Date.now()}`, skill: skill.trim(), proficiency };
      return { ...s, currentUser: { ...s.currentUser, skillsToTeach: [...s.currentUser.skillsToTeach, entry] } };
    });
    addToast(`Added "${skill}" to your teaching skills ✅`);
  }, [addToast]);

  const addSkillToLearn = useCallback((skill: string) => {
    if (!skill.trim()) return;
    setState((s) => {
      if (!s.currentUser) return s;
      const entry: SkillEntry = { id: `sl-${Date.now()}`, skill: skill.trim() };
      return { ...s, currentUser: { ...s.currentUser, skillsToLearn: [...s.currentUser.skillsToLearn, entry] } };
    });
    addToast(`Added "${skill}" to your learning wishlist 📚`);
  }, [addToast]);

  const removeSkillToTeach = useCallback((id: string) => {
    setState((s) => {
      if (!s.currentUser) return s;
      return { ...s, currentUser: { ...s.currentUser, skillsToTeach: s.currentUser.skillsToTeach.filter((sk) => sk.id !== id) } };
    });
    addToast("Skill removed", "info");
  }, [addToast]);

  const removeSkillToLearn = useCallback((id: string) => {
    setState((s) => {
      if (!s.currentUser) return s;
      return { ...s, currentUser: { ...s.currentUser, skillsToLearn: s.currentUser.skillsToLearn.filter((sk) => sk.id !== id) } };
    });
    addToast("Skill removed", "info");
  }, [addToast]);

  const updateBio = useCallback((bio: string) => {
    setState((s) => {
      if (!s.currentUser) return s;
      return { ...s, currentUser: { ...s.currentUser, bio } };
    });
    addToast("Profile updated ✅");
  }, [addToast]);

  const scheduleSession = useCallback((data: { type: "teaching" | "learning"; skill: string; partnerName: string; date: string; time: string; durationMin: number }) => {
    const tokens = data.durationMin <= 30 ? 10 : data.durationMin <= 60 ? 15 : 20;
    const session: Session = {
      id: `s-${Date.now()}`,
      ...data,
      tokens: data.type === "teaching" ? tokens : -tokens,
      status: "upcoming",
    };
    setState((s) => ({
      ...s,
      sessions: [session, ...s.sessions],
    }));
    addToast(`Session scheduled with ${data.partnerName}! 📅`);
  }, [addToast]);

  const cancelSession = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((sess) => (sess.id === id ? { ...sess, status: "cancelled" as const } : sess)),
    }));
    addToast("Session cancelled", "info");
  }, [addToast]);

  const completeSession = useCallback((id: string) => {
    setState((s) => {
      const sess = s.sessions.find((ss) => ss.id === id);
      if (!sess || !s.currentUser) return s;
      const tokenChange = sess.tokens;
      const tx: TokenTransaction = {
        id: `t-${Date.now()}`,
        date: "Today",
        desc: `${sess.type === "teaching" ? "Teaching" : "Learning"}: ${sess.skill} ${sess.type === "teaching" ? "to" : "from"} ${sess.partnerName}`,
        amount: tokenChange,
      };
      return {
        ...s,
        sessions: s.sessions.map((ss) => (ss.id === id ? { ...ss, status: "completed" as const } : ss)),
        currentUser: { ...s.currentUser, tokenBalance: s.currentUser.tokenBalance + tokenChange },
        transactions: [tx, ...s.transactions],
      };
    });
    addToast("Session completed! Tokens updated 🪙");
  }, [addToast]);

  const leaveReview = useCallback((sessionId: string, rating: number, comment: string) => {
    const sess = state.sessions.find((s) => s.id === sessionId);
    if (!sess) return;
    const review: Review = {
      id: `r-${Date.now()}`,
      reviewerName: state.currentUser?.name || "You",
      rating,
      comment,
    };
    setState((s) => ({
      ...s,
      reviews: [review, ...s.reviews],
      showModal: null,
      modalData: {},
    }));
    addToast(`Review submitted for ${sess.partnerName}! ⭐`);
  }, [addToast, state.sessions, state.currentUser?.name]);

  const showModalFn = useCallback((modal: string | null, data?: Record<string, string>) => {
    setState((s) => ({ ...s, showModal: modal, modalData: data || {} }));
  }, []);

  const banUser = useCallback((userId: string) => {
    setState((s) => ({
      ...s,
      matches: s.matches.filter((m) => m.userId !== userId),
    }));
    addToast("User has been banned from the platform", "info");
  }, [addToast]);

  const exportCSV = useCallback(() => {
    const header = "Date,Description,Amount\n";
    const rows = state.transactions.map((t) => `${t.date},"${t.desc}",${t.amount}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edubond_transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
    addToast("CSV exported! 📄");
  }, [addToast, state.transactions]);

  const syncCalendar = useCallback(() => {
    const events = state.sessions
      .filter((s) => s.status === "upcoming")
      .map((s) => {
        return [
          "BEGIN:VEVENT",
          `SUMMARY:EduBond: ${s.type === "teaching" ? "Teaching" : "Learning"} ${s.skill}`,
          `DESCRIPTION:Session with ${s.partnerName} (${s.durationMin} min)`,
          `DTSTART:20260408T160000`,
          "END:VEVENT",
        ].join("\n");
      });
    const cal = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//EduBond//EN", ...events, "END:VCALENDAR"].join("\n");
    const blob = new Blob([cal], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edubond_sessions.ics";
    a.click();
    URL.revokeObjectURL(url);
    addToast("Calendar file downloaded! 📅");
  }, [addToast, state.sessions]);

  const GRADIENT_POOL = [
    "linear-gradient(135deg, #c084fc, #818cf8)",
    "linear-gradient(135deg, #34d399, #06b6d4)",
    "linear-gradient(135deg, #f59e0b, #ef4444)",
    "linear-gradient(135deg, #ec4899, #8b5cf6)",
    "linear-gradient(135deg, #06b6d4, #3b82f6)",
    "linear-gradient(135deg, #a78bfa, #f472b6)",
    "linear-gradient(135deg, #f97316, #eab308)",
    "linear-gradient(135deg, #14b8a6, #8b5cf6)",
  ];

  const addPeer = useCallback((data: { name: string; university: string; major: string; teaches: string[]; learns: string[]; tokenCost: number }) => {
    if (!data.name.trim() || data.teaches.length === 0) {
      addToast("Name and at least one teaching skill are required", "error");
      return;
    }
    const peer: MatchCard = {
      userId: `peer-${Date.now()}`,
      name: data.name.trim(),
      university: data.university.trim(),
      major: data.major.trim(),
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      avatarGradient: GRADIENT_POOL[Math.floor(Math.random() * GRADIENT_POOL.length)],
      matchType: data.learns.length > 0 ? "direct_swap" : "one_way",
      tokenCost: data.tokenCost || 10,
      teaches: data.teaches,
      learns: data.learns,
      connected: false,
    };
    setState((s) => ({ ...s, matches: [peer, ...s.matches] }));
    addToast(`${data.name} added to the platform! 🎉`);
  }, [addToast]);

  const googleLogin = useCallback((name: string, email: string) => {
    if (!name.trim() || !email.trim()) {
      addToast("Name and email are required", "error");
      return false;
    }
    setState((s) => {
      if (s.currentUser && s.currentUser.email === email) {
        return { ...s, isLoggedIn: true };
      }
      const uni = email.split("@")[1]?.replace(".com", "").replace(".edu", "").replace(/\b\w/g, (c) => c.toUpperCase()) || "";
      const user: User = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email,
        university: uni,
        emailVerified: true,
        bio: "",
        major: "",
        year: "",
        reputationScore: 0,
        tokenBalance: 50,
        role: "admin",
        avatarGradient: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
        skillsToTeach: [],
        skillsToLearn: [],
        badges: DEFAULT_BADGES.map((b) => ({ ...b })),
      };
      return {
        ...s,
        isLoggedIn: true,
        currentUser: user,
        transactions: [{ id: `t-${Date.now()}`, date: "Today", desc: "Sign-Up Bonus", amount: 50 }, ...s.transactions],
      };
    });
    addToast(`Welcome, ${name}! Signed in with Google 🎉`);
    return true;
  }, [addToast]);

  const value: AppContextType = {
    ...state,
    login,
    register,
    logout,
    connectMatch,
    sendMessage,
    setSearchQuery,
    setActiveFilter,
    setActiveConversation,
    addSkillToTeach,
    addSkillToLearn,
    removeSkillToTeach,
    removeSkillToLearn,
    updateBio,
    scheduleSession,
    cancelSession,
    completeSession,
    leaveReview,
    showModalFn,
    addToast,
    dismissToast,
    banUser,
    exportCSV,
    syncCalendar,
    addPeer,
    googleLogin,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
