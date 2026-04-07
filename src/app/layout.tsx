import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import ClientShell from "@/components/client-shell";

export const metadata: Metadata = {
  title: "EduBond | Peer-to-Peer College Skill Exchange",
  description:
    "Connect with your college community to teach what you know and learn what you need. Smart matching, flexible scheduling, and a gamified reputation system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <ClientShell>{children}</ClientShell>
        </AppProvider>
      </body>
    </html>
  );
}
