"use server";

import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// Helper for default gradient
const getRandomGradient = () => {
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
  return GRADIENT_POOL[Math.floor(Math.random() * GRADIENT_POOL.length)];
};

export async function loginUser(email: string, password?: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        skillsToTeach: true,
        skillsToLearn: true,
        badges: true,
      },
    });

    if (!user) {
      return { success: false, message: "User not found." };
    }

    if (password && user.passwordHash) {
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        return { success: false, message: "Invalid password." };
      }
    }

    // Map Prisma models to Client interfaces
    return { success: true, user: mapPrismaToUser(user) };
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: "Server error occurred." };
  }
}

export async function registerUser(data: { name: string; email: string; university: string; major: string; year: string; password?: string }) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return { success: false, message: "Email already registered." };
    }

    const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : "";

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        university: data.university,
        major: data.major,
        year: data.year,
        passwordHash,
        avatarUrl: getRandomGradient(),
        tokenBalance: 50,
        emailVerified: false,
        bio: "",
        reputationScore: 0,
      },
      include: {
        skillsToTeach: true,
        skillsToLearn: true,
        badges: true,
      },
    });

    // Award signup bonus transaction
    await prisma.tokenTransaction.create({
      data: {
        userId: user.id,
        amount: 50,
        reason: "signup_bonus",
      },
    });

    return { success: true, user: mapPrismaToUser(user) };
  } catch (error) {
    console.error("Register Error:", error);
    return { success: false, message: "Failed to create account." };
  }
}

export async function getUserData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skillsToTeach: true,
        skillsToLearn: true,
        badges: true,
      },
    });

    if (!user) return null;

    // Fetch transactions
    const tokens = await prisma.tokenTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Fetch sessions
    const sessions = await prisma.session.findMany({
      where: {
        match: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
      },
      include: {
        match: {
          include: {
             user1: true,
             user2: true,
          }
        }
      },
      orderBy: { scheduledAt: "desc" },
    });

    return {
      user: mapPrismaToUser(user),
      transactions: tokens.map(t => ({
        id: t.id,
        date: t.createdAt.toLocaleDateString(),
        desc: t.reason,
        amount: t.amount,
      })),
      // Mapped sessions will go here, currently returning raw for now
      rawSessions: sessions,
    };
  } catch (error) {
    console.error("Fetch Data Error:", error);
    return null;
  }
}

// Utility to map DB objects to frontend objects
function mapPrismaToUser(prismaUser: any) {
  return {
    id: prismaUser.id,
    name: prismaUser.name,
    email: prismaUser.email,
    university: prismaUser.university,
    major: prismaUser.major || "",
    year: prismaUser.year || "",
    bio: prismaUser.bio || "",
    reputationScore: prismaUser.reputationScore,
    tokenBalance: prismaUser.tokenBalance,
    role: prismaUser.role as "student" | "admin",
    emailVerified: prismaUser.emailVerified,
    avatarGradient: prismaUser.avatarUrl || "linear-gradient(135deg, #8b5cf6, #06b6d4)",
    skillsToTeach: prismaUser.skillsToTeach?.map((s: any) => ({
      id: s.id,
      skill: s.skill,
      proficiency: s.proficiency,
    })) || [],
    skillsToLearn: prismaUser.skillsToLearn?.map((s: any) => ({
      id: s.id,
      skill: s.skill,
    })) || [],
    badges: prismaUser.badges?.map((b: any) => ({
      id: b.id,
      emoji: b.iconEmoji || "⭐",
      name: b.name || "Badge",
      earned: true,
    })) || [],
  };
}
