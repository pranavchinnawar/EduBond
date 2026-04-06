"use client";

import Navbar from "@/components/navbar";
import { ToastContainer, Modal } from "@/components/overlays";
import { ReactNode } from "react";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: "1.5rem", paddingBottom: "4rem" }}>
        {children}
      </main>
      <Modal />
      <ToastContainer />
    </>
  );
}
