"use client";

import { SessionProvider } from "next-auth/react";
import { AuthApiProvider } from "./auth-api-provider";

export function AppSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthApiProvider>{children}</AuthApiProvider>
    </SessionProvider>
  );
}
