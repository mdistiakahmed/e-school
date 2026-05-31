"use client";

import { SessionProvider } from "next-auth/react";
import { LoginModalProvider } from "@/context/LoginModalContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LoginModalProvider>{children}</LoginModalProvider>
    </SessionProvider>
  );
}